from rest_framework import serializers
from .models import ProfessionalContact

class ProfessionalContactListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing contacts.
    """
    class Meta:
        model = ProfessionalContact
        fields = [
            'id', 'created', 'modified', 
            'is_platform_wide', 'privacy_status', 
            'first_name', 'last_name', 'profile_image_url', 
            'company', 'designation', 
            'email', 'phone', 
            'linkedin_url', 'x_url', 'other_social_links', 
            'context_notes'
        ]

class ProfessionalContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalContact
        fields = [
            'id', 'created', 'modified', 
            'is_platform_wide', 'privacy_status', 
            'first_name', 'last_name', 'profile_image_url', 
            'company', 'designation', 
            'email', 'phone', 
            'linkedin_url', 'x_url', 'other_social_links', 
            'context_notes'
        ]
        read_only_fields = ['created', 'modified', 'privacy_status', 'is_platform_wide']
