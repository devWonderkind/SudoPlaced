from rest_framework import serializers
from django.db.models import Q
from .models import JobApplication, ApplicationHistory, KeyNote, ApplicationStatus
from directory.serializers import ProfessionalContactSerializer
from directory.models import ProfessionalContact

class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationStatus
        fields = ['id', 'name', 'order', 'is_default']
        read_only_fields = ['is_default']

    def create(self, validated_data):
        user = self.context['request'].user
        return ApplicationStatus.objects.create(user=user, **validated_data)

class KeyNoteSerializer(serializers.ModelSerializer):
    application_id = serializers.PrimaryKeyRelatedField(
        queryset=JobApplication.objects.none(),  # Detailed query set in __init__
        source='application', 
        write_only=True
    )

    class Meta:
        model = KeyNote
        fields = ['id', 'application_id', 'created', 'modified', 'title', 'content_json', 'content_markdown', 'is_pinned']
        read_only_fields = ['user']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            self.fields['application_id'].queryset = JobApplication.objects.filter(user=user)

    def create(self, validated_data):
        user = self.context['request'].user
        return KeyNote.objects.create(user=user, **validated_data)

class ApplicationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationHistory
        fields = ['id', 'created', 'previous_status', 'new_status', 'update_notes', 'stage_data']


# --- Job Application Serializers ---

class JobApplicationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing applications.
    Excludes heavy JSON fields or nested relationships.
    """
    status_label = serializers.CharField(source='status.name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'role_title', 'company_name', 'company_logo', 
            'location', 'work_mode', 'status', 'status_label', 'applied_on', 
            'interview_date', 'priority_order', 'modified'
        ]

class JobApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer including history, notes, and full contacts.
    """
    status_label = serializers.CharField(source='status.name', read_only=True)
    history = ApplicationHistorySerializer(many=True, read_only=True)
    notes = KeyNoteSerializer(many=True, read_only=True)
    hr_contacts = ProfessionalContactSerializer(many=True, read_only=True)
    
    # Write-only field to handle updating contacts by ID
    hr_contact_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = JobApplication
        fields = [
            'id', 'created', 'modified', 
            'role_title', 'company_name', 'company_logo', 'job_url',
            'location', 'work_mode', 'expected_salary', 'status', 'status_label',
            'priority_order', 'dynamic_assets', 'hr_contacts', 'hr_contact_ids',
            'applied_on', 'interview_date', 'reminder_duration_days',
            'history', 'notes'
        ]
        read_only_fields = ['user', 'created', 'modified']

    def validate_status(self, value):
        user = self.context['request'].user
        if value and value.user != user:
             raise serializers.ValidationError("Invalid status. You can only assign statuses that belong to your account.")
        return value

    def to_internal_value(self, data):
        # Allow passing status as integer ID or null
        if 'status' in data:
            if data['status'] == "":
                data['status'] = None
        return super().to_internal_value(data)


    def validate_hr_contact_ids(self, value):

        user = self.context['request'].user
        contact_ids = set(value)
        
        # Check if contacts exist and user has permission
        valid_contacts = ProfessionalContact.objects.filter(
            id__in=contact_ids
        ).filter(
            Q(user=user) | Q(privacy_status='Public') | Q(is_platform_wide=True)
        ).values_list('id', flat=True)
        
        valid_ids = set(valid_contacts)
        invalid_ids = contact_ids - valid_ids
        
        if invalid_ids:
            raise serializers.ValidationError(
                f"Invalid contacts or permission denied for IDs: {list(invalid_ids)}"
            )
        return value

    def create(self, validated_data):
        hr_contact_ids = validated_data.pop('hr_contact_ids', [])
        user = self.context['request'].user
        
        # Determine default status if not provided or None
        if 'status' not in validated_data or validated_data['status'] is None:
             # Try 'Bookmarked' first, else lowest ordered status
             default_status = ApplicationStatus.objects.filter(user=user, name='Bookmarked').first()
             if not default_status:
                 default_status = ApplicationStatus.objects.filter(user=user).order_by('order').first()
             
             if default_status:
                 validated_data['status'] = default_status
        
        # 'user' is passed to save() via perform_create usually, 
        # but if we use .create() here directly, we must ensure it's set.
        # But `perform_create` in ViewSet calls `serializer.save(user=request.user)`.
        # When `save` is called with kwarg, it adds it to validated_data.
        # So `user` should be in validated_data if passed from view.
        if 'user' not in validated_data:
             validated_data['user'] = user

        application = JobApplication.objects.create(**validated_data)
        
        if hr_contact_ids:
            application.hr_contacts.set(hr_contact_ids)
            
        return application

    def update(self, instance, validated_data):
        hr_contact_ids = validated_data.pop('hr_contact_ids', None)
        
        # Check if status changed to log history
        if 'status' in validated_data:
            new_status = validated_data['status']
            if new_status != instance.status:
                prev_name = instance.status.name if instance.status else 'None'
                new_name = new_status.name if new_status else 'None'
                
                ApplicationHistory.objects.create(
                    application=instance,
                    previous_status=prev_name,
                    new_status=new_name,
                    update_notes="Status updated via API"
                )

        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update ManyToMany relationships if provided
        if hr_contact_ids is not None:
             instance.hr_contacts.set(hr_contact_ids)

        return instance
