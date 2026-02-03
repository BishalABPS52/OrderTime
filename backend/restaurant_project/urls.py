"""
Main URL Configuration for OrderTime Restaurant Project.

This file routes URLs to the appropriate app.
All API endpoints are prefixed with /api/
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.site.urls),
    
    # API endpoints - all prefixed with /api/
    path('api/', include('orders.urls')),
]
