from rest_framework import viewsets, filters 
from django_filters.rest_framework import DjangoFilterBackend
from .models import ProfessionalContact
from .serializers import ProfessionalContactSerializer, ProfessionalContactListSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied

class ProfessionalContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Professional Contacts.
    Users can see their own contacts + Public/Platform-wide contacts.
    However, they can only Edit/Delete their own contacts.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'company', 'designation', 'email']
    ordering_fields = ['created', 'modified', 'first_name', 'company']
    ordering = ['-modified']
    filterset_fields = ['company', 'privacy_status', 'is_platform_wide']

    def get_queryset(self):
        user = self.request.user
        # Return user's private contacts AND any public/platform-wide contacts (if any exist)
        return ProfessionalContact.objects.filter(
            Q(user=user) | Q(privacy_status='Public') | Q(is_platform_wide=True)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProfessionalContactListSerializer
        return ProfessionalContactSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Additional check strictly for update action
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own contacts.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own contacts.")
        instance.delete()
