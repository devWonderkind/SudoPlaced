from django.contrib import admin
from .models import JobApplication, ApplicationHistory, KeyNote, ApplicationStatus

@admin.register(ApplicationStatus)
class ApplicationStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'order', 'is_default')
    list_filter = ('is_default',)
    search_fields = ('name', 'user__email')

class ApplicationHistoryInline(admin.TabularInline):
    model = ApplicationHistory
    extra = 0
    readonly_fields = ('created', 'previous_status', 'new_status', 'update_notes')
    can_delete = False

class KeyNoteInline(admin.TabularInline):
    model = KeyNote
    extra = 0
    fields = ('title', 'is_pinned', 'created', 'modified')
    readonly_fields = ('created', 'modified')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('role_title', 'company_name', 'user', 'status', 'work_mode', 'applied_on', 'is_deleted')
    list_filter = ('status', 'work_mode', 'is_deleted', 'created')
    search_fields = ('role_title', 'company_name', 'user__email')
    inlines = [ApplicationHistoryInline, KeyNoteInline]
    readonly_fields = ('created', 'modified')

@admin.register(ApplicationHistory)
class ApplicationHistoryAdmin(admin.ModelAdmin):
    list_display = ('application', 'previous_status', 'new_status', 'created')
    readonly_fields = ('created',)

@admin.register(KeyNote)
class KeyNoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'application', 'user', 'is_pinned', 'created')
    list_filter = ('is_pinned', 'created')
    search_fields = ('title', 'content_markdown')
