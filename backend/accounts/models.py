from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email Address"), unique=True, max_length=255)
    full_name = models.CharField(_("Full Name"), max_length=255)
    profile_pic = models.ImageField(_("Profile Picture"), upload_to='profile_pics/%Y/%m/', null=True, blank=True)
    google_profile_pic = models.URLField(max_length=500, null=True, blank=True)
    is_active = models.BooleanField(default=False) # Verification required
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email