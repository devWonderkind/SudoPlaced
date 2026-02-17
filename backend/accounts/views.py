from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
import requests

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            # Set cookie
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,  # Prevent XSS
                secure=not settings.DEBUG, # HTTPS only in prod
                samesite='Lax',
                path='/',
                max_age=3600 # 1 hour
            )
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out successfully"}, status=status.HTTP_200_OK)
        # We delete the cookie by setting it to empty and expiring it immediately
        response.delete_cookie('access_token', samesite='Lax')
        return response

class SimpleGoogleLoginView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        
        # Verify with Google
        google_res = requests.get(
            f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}'
        )
        
        if google_res.status_code != 200:
            return Response({"detail": "Invalid Google Token"}, status=400)

        data = google_res.json()
        email = data.get('email')
        google_picture_url = data.get('picture')

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={'full_name': data.get('name', ''), 'is_active': True}
        )

        # 1. Update the NEW Google field
        user.google_profile_pic = google_picture_url
        user.save()

        # 2. Setup JWT & Response
        refresh = RefreshToken.for_user(user)
        
        # 3. SECURE DATA: Only send strings to the frontend
        # Do NOT include user.profile_pic here, it's an object and will crash JSON!
        response_data = {
            "detail": "Login successful",
            "user": {
                "email": user.email,
                "full_name": user.full_name,
                "google_profile_pic": user.google_profile_pic,
                "profile_pic": user.profile_pic.url if user.profile_pic else None
            }
        }
        
        response = Response(response_data, status=200)
        
        # Set the HttpOnly cookie
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            path='/',
        )
        
        return response