from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import ApplicationStatus
from django.contrib.auth import get_user_model

DEFAULT_STATUSES = [
    ('Bookmarked', 0),
    ('Applied', 1),
    ('Assessment', 2),
    ('Interviewing', 3),
    ('Offered', 4),
    ('Rejected', 5),
    ('Ghosted', 6),
]

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_default_application_statuses(sender, instance, created, **kwargs):
    if created:
        statuses = []
        for name, order in DEFAULT_STATUSES:
            statuses.append(ApplicationStatus(user=instance, name=name, order=order, is_default=True))
        ApplicationStatus.objects.bulk_create(statuses)
