from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
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


class ConnectGoogleAccountView(APIView):
    """
    Authenticated users only.
    Links a verified Google account to the logged-in user.
    The Google email MUST match the account email — prevents account hijacking.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({"detail": "access_token is required."}, status=400)

        # Verify the token with Google
        google_res = requests.get(
            f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}'
        )
        if google_res.status_code != 200:
            return Response({"detail": "Invalid Google token."}, status=400)

        google_data = google_res.json()
        google_email = google_data.get('email', '').lower().strip()
        user_email = request.user.email.lower().strip()

        # ── Email must match ──────────────────────────────────────────────
        if google_email != user_email:
            return Response(
                {
                    "detail": (
                        f"The Google account ({google_email}) does not match your "
                        f"account email ({user_email}). Please use the Google account "
                        "that belongs to this email address."
                    )
                },
                status=400,
            )

        # Update google_profile_pic on the authenticated user
        request.user.google_profile_pic = google_data.get('picture')
        request.user.save(update_fields=['google_profile_pic'])

        return Response(
            {
                "detail": "Google account connected successfully.",
                "google_profile_pic": request.user.google_profile_pic,
            },
            status=200,
        )


class SetInitialPasswordView(APIView):
    """
    For users who authenticated via Google and have no password yet.
    Sets the first password without requiring a current_password check.
    Blocked if the user already has a usable password (use Djoser set_password instead).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Guard: already has password → use Djoser set_password endpoint
        if user.has_usable_password():
            return Response(
                {"detail": "You already have a password. Use the change-password endpoint instead."},
                status=400,
            )

        new_password = request.data.get('new_password', '')
        re_new_password = request.data.get('re_new_password', '')

        if not new_password:
            return Response({"new_password": ["This field is required."]}, status=400)

        if new_password != re_new_password:
            return Response({"re_new_password": ["Passwords don't match."]}, status=400)

        # Run Django's password validators
        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({"new_password": list(e.messages)}, status=400)

        user.set_password(new_password)
        user.save(update_fields=['password'])

        return Response({"detail": "Password set successfully."}, status=200)
