from django.contrib import admin
from .models import ProfessionalContact

@admin.register(ProfessionalContact)
class ProfessionalContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'company', 'designation', 'email', 'privacy_status', 'is_platform_wide')
    list_filter = ('privacy_status', 'is_platform_wide', 'created')
    search_fields = ('first_name', 'last_name', 'company', 'email', 'designation')
    readonly_fields = ('created', 'modified')
