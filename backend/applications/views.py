from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import JobApplication, ApplicationHistory, KeyNote, ApplicationStatus
from .serializers import (
    JobApplicationListSerializer, 
    JobApplicationDetailSerializer, 
    ApplicationHistorySerializer,
    KeyNoteSerializer,
    ApplicationStatusSerializer
)
from .filters import JobApplicationFilter


class ApplicationStatusViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing custom application statuses (Kanban columns).
    """
    queryset = ApplicationStatus.objects.none() # Default for schema generation
    serializer_class = ApplicationStatusSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ApplicationStatus.objects.filter(user=self.request.user).order_by('order')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['post'])
    def restore_defaults(self, request):
        """
        Create default statuses for the user if they don't exist.
        """
        DEFAULT_STATUSES = [
            ('Bookmarked', 0),
            ('Applied', 1),
            ('Assessment', 2),
            ('Interviewing', 3),
            ('Offered', 4),
            ('Rejected', 5),
            ('Ghosted', 6),
        ]
        
        created_count = 0
        for name, order in DEFAULT_STATUSES:
            status, created = ApplicationStatus.objects.get_or_create(
                user=request.user, 
                name=name, 
                defaults={'order': order, 'is_default': True}
            )
            if created:
                created_count += 1
                
        return Response({'status': f'Created {created_count} default statuses'})

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Bulk update order of statuses.
        Expects: [{id: 1, order: 0}, {id: 2, order: 1}, ...]
        """
        updates = request.data
        if not isinstance(updates, list):
            return Response({'error': 'Expected a list of updates'}, status=status.HTTP_400_BAD_REQUEST)
            
        for item in updates:
            pk = item.get('id')
            new_order = item['order'] # Use subscription if dict is guaranteed or .get
            if pk is not None and new_order is not None:
                ApplicationStatus.objects.filter(id=pk, user=request.user).update(order=new_order)
                
        return Response({'status': 'orders updated'})

class KeyNoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Notes/KeyNotes.
    Users can list all their notes or filter by application.
    """
    serializer_class = KeyNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['application', 'is_pinned']
    search_fields = ['title', 'content_markdown']
    ordering_fields = ['created', 'modified']
    ordering = ['-is_pinned', '-modified']

    def get_queryset(self):
        return KeyNote.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Job Applications.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobApplicationFilter
    search_fields = ['role_title', 'company_name', 'location']
    ordering_fields = ['applied_on', 'modified', 'interview_date', 'priority_order', 'status']
    ordering = ['priority_order', '-modified']

    def get_queryset(self):
        # Ensure users only see their own applications and exclude deleted ones
        return JobApplication.objects.filter(user=self.request.user, is_deleted=False)

    def get_serializer_class(self):
        if self.action == 'list':
            return JobApplicationListSerializer
        return JobApplicationDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete the application instead of hard deletion
        instance.is_deleted = True
        instance.save()
        
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Custom action to retrieve history for a specific application.
        Check if application is logically deleted before returning history.
        """
        application = self.get_object() 
        # get_object() uses get_queryset() which already filters is_deleted=False
        
        history_qs = ApplicationHistory.objects.filter(application=application).order_by('-created')
        serializer = ApplicationHistorySerializer(history_qs, many=True)
        return Response(serializer.data)

