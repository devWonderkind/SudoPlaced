from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'target_user', 'created_by_admin', 'created', 'is_read')
    list_filter = ('notification_type', 'is_read', 'created_by_admin', 'created')
    search_fields = ('title', 'description')
    readonly_fields = ('created', 'modified')
