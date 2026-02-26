from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'created', 'modified', 'notification_type', 'title', 'description', 
            'image', 'action_url', 'is_read', 'trigger_datetime'
        ]
        read_only_fields = ['created', 'modified', 'is_read', 'created_by_admin', 'target_user']

    def validate_notification_type(self, value):
        user = self.context['request'].user
        # Regular users can only create 'Job_Reminder' type notifications
        # Admin users might have broader permissions, but for now enforcing this restriction
        if not user.is_staff and value != 'Job_Reminder':
             raise serializers.ValidationError("Users can only create 'Job_Reminder' notifications.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        # Ensure the notification is always created for the request user
        return Notification.objects.create(target_user=user, **validated_data)
