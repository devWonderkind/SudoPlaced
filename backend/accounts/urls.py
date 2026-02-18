from django.urls import path, include
from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    SimpleGoogleLoginView,
    ConnectGoogleAccountView,
    SetInitialPasswordView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # 1. Override the specific login endpoint BEFORE Djoser
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),

    # 2. Include the rest of Djoser (registration, activation, set_password, reset_password, etc.)
    path('', include('djoser.urls')),

    # 3. Custom auth endpoints
    path('google/simple/', SimpleGoogleLoginView.as_view(), name='google-simple'),
    path('connect-google/', ConnectGoogleAccountView.as_view(), name='connect-google'),
    path('set-initial-password/', SetInitialPasswordView.as_view(), name='set-initial-password'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
