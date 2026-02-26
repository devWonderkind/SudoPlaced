from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # Keep this
from django.conf.urls.static import static

# Access DOMAIN and SITE_NAME through the settings object
SITE_NAME = getattr(settings, 'SITE_NAME', 'SudoPlaced')
DOMAIN = getattr(settings, 'DOMAIN', 'localhost')

# Global Admin Interface Customization
admin.site.site_header = f"{SITE_NAME} Administration"   
admin.site.site_title = f"{SITE_NAME} Admin Portal"     
admin.site.index_title = f"Welcome to {SITE_NAME}"       
admin.site.site_url = f"https://{DOMAIN}"        

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)