import django_filters
from .models import JobApplication

class JobApplicationFilter(django_filters.FilterSet):
    # Filter by Status ID (e.g. ?status=1)
    status = django_filters.NumberFilter(field_name='status__id')
    # Filter by Status Name (e.g. ?status_name=Applied)
    status_name = django_filters.CharFilter(field_name='status__name', lookup_expr='icontains')
    
    role_title = django_filters.CharFilter(lookup_expr='icontains')
    company_name = django_filters.CharFilter(lookup_expr='icontains')
    location = django_filters.CharFilter(lookup_expr='icontains')
    work_mode = django_filters.CharFilter(lookup_expr='iexact')
    applied_after = django_filters.DateFilter(field_name='applied_on', lookup_expr='gte')
    applied_before = django_filters.DateFilter(field_name='applied_on', lookup_expr='lte')

    class Meta:
        model = JobApplication
        fields = ['status', 'status_name', 'work_mode', 'role_title', 'company_name', 'location']