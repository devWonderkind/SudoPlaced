from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    list_display = ("email", "full_name", "is_staff", "is_active", "date_joined")
    list_filter = ("is_staff", "is_superuser", "is_active")

    # Fields to be used in displaying the User model.
    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {"fields": ("full_name", "profile_pic", "google_profile_pic")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        # Now this will work because it's listed in readonly_fields above
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Required for custom User models
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "password", "is_active"),
            },
        ),
    )
    search_fields = ("email", "full_name")
    ordering = ("email",)
