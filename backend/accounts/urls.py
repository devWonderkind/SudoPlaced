from django.urls import path, include
from .views import CustomTokenObtainPairView ,LogoutView,SimpleGoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # 1. Override the specific login endpoint BEFORE Djoser
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),

    # 2. Include the rest of Djoser (registration, activation, etc.)
    path('', include('djoser.urls')),
    
    # 3. We skip djoser.urls.jwt because we manually added the views above
    path('google/simple/', SimpleGoogleLoginView.as_view(), name='google-simple'),
    # path('social/', include('djoser.social.urls')),a
    path('logout/', LogoutView.as_view(), name='logout'),
]