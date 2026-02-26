from django.db import models
from django_extensions.db.models import TimeStampedModel, ActivatorModel
from django.conf import settings

class Notification(TimeStampedModel, ActivatorModel):
    NOTIFICATION_TYPES = (
        ('System', 'System'),
        ('Job_Reminder', 'Job Reminder'),
        ('Admin_Broadcast', 'Admin Broadcast'),
        ('Milestone', 'Milestone'),
    )

    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    created_by_admin = models.BooleanField(default=False)
    
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    image = models.ImageField(upload_to='notifications/', null=True, blank=True)
    action_url = models.CharField(max_length=500, blank=True)
    
    is_read = models.BooleanField(default=False)
    trigger_datetime = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} - {self.notification_type}"

