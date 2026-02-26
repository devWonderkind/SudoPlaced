from django.db import models
from django_extensions.db.models import TimeStampedModel, ActivatorModel
from django.conf import settings

class ProfessionalContact(TimeStampedModel, ActivatorModel):
    PRIVACY_CHOICES = (
        ('Private', 'Private'),
        ('Public_Pending', 'Public Pending'),
        ('Public', 'Public'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='professional_contacts')
    is_platform_wide = models.BooleanField(default=False)
    privacy_status = models.CharField(max_length=20, choices=PRIVACY_CHOICES, default='Private')

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, blank=True)
    profile_image_url = models.URLField(blank=True, max_length=500)
    
    company = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    
    linkedin_url = models.URLField(blank=True, max_length=500)
    x_url = models.URLField(blank=True, max_length=500)
    other_social_links = models.JSONField(default=dict, blank=True)
    
    context_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company}"

    class Meta:
        verbose_name_plural = "Professional Contacts"

