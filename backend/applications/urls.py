from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobApplicationViewSet, KeyNoteViewSet, ApplicationStatusViewSet

router = DefaultRouter()
router.register(r'applications', JobApplicationViewSet, basename='jobapplication')
router.register(r'statuses', ApplicationStatusViewSet, basename='applicationstatus')
router.register(r'notes', KeyNoteViewSet, basename='keynote')

urlpatterns = [
    path('', include(router.urls)),
]
