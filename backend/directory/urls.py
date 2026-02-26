from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfessionalContactViewSet

router = DefaultRouter()
router.register(r'contacts', ProfessionalContactViewSet, basename='professionalcontact')

urlpatterns = [
    path('', include(router.urls)),
]
