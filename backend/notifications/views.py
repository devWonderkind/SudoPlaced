from rest_framework import viewsets, filters 
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user Notifications.
    Users can list, mark read, delete their own notifications.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['created', 'is_read']
    ordering = ['-created']  # Newest first

    def get_queryset(self):
        # Only show notifications targeted to the user
        return Notification.objects.filter(target_user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(target_user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(target_user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})
