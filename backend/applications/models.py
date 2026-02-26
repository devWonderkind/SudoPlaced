from django.db import models
from django_extensions.db.models import TimeStampedModel, ActivatorModel
from django.conf import settings

class ApplicationStatus(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='application_statuses', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Application Statuses"
        ordering = ['order']
        unique_together = ('user', 'name')

    def __str__(self):
        return f"{self.name} ({self.user})"

class JobApplication(TimeStampedModel, ActivatorModel):
    # Old choices for reference or migration if needed
    STATUS_CHOICES = (
        ('Bookmarked', 'Bookmarked'),
        ('Applied', 'Applied'),
        ('Assessment', 'Assessment'),
        ('Interviewing', 'Interviewing'),
        ('Offered', 'Offered'),
        ('Rejected', 'Rejected'),
        ('Ghosted', 'Ghosted'),
    )
    WORK_MODE_CHOICES = (
        ('Remote', 'Remote'),
        ('Hybrid', 'Hybrid'),
        ('On-site', 'On-site'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='job_applications', on_delete=models.CASCADE)
    role_title = models.CharField(max_length=255)
    
    # We are replacing the hardcoded status choice with a ForeignKey
    # Allowing null for migration purposes, but logic should enforce it
    status = models.ForeignKey(ApplicationStatus, on_delete=models.PROTECT, related_name='applications', null=True, blank=True)
    
    company_name = models.CharField(max_length=255)
    company_logo = models.URLField(blank=True, max_length=500)
    job_url = models.URLField(blank=True, max_length=500)
    location = models.CharField(max_length=255, blank=True)
    work_mode = models.CharField(max_length=50, choices=WORK_MODE_CHOICES, blank=True)
    expected_salary = models.CharField(max_length=100, blank=True)
    
    # Field to support Kanban board reordering within a status column
    priority_order = models.PositiveIntegerField(default=0)
    
    is_deleted = models.BooleanField(default=False)

    dynamic_assets = models.JSONField(default=dict, blank=True)
    # Use string reference to avoid circular import issues
    hr_contacts = models.ManyToManyField('directory.ProfessionalContact', blank=True, related_name='job_applications')
    
    applied_on = models.DateField(null=True, blank=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    reminder_duration_days = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.role_title} at {self.company_name}"
    
    class Meta:
        verbose_name_plural = "Job Applications"

class ApplicationHistory(TimeStampedModel):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='history')
    previous_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    update_notes = models.CharField(max_length=500, blank=True)
    stage_data = models.JSONField(default=dict, blank=True)

    def __str__(self):
        try:
            return f"{self.application.company_name} - {self.previous_status} -> {self.new_status}"
        except:
             return f"Application History {self.id}"
    
    class Meta:
        verbose_name_plural = "Application Histories"

class KeyNote(TimeStampedModel):
    # notes can be linked to an application or just general notes for user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='key_notes', on_delete=models.CASCADE)
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, null=True, blank=True, related_name='notes')
    title = models.CharField(max_length=255)
    content_json = models.JSONField(default=list) # For BlockNote editor
    content_markdown = models.TextField(blank=True) # For search/preview
    is_pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title

