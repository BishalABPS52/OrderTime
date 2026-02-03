"""
Django Admin Configuration for Orders App.

Register models here to manage them via Django Admin panel.
Access admin at: http://localhost:8000/admin/
"""

from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin interface for Order model.
    
    This allows you to view, create, edit, and delete orders
    through the Django admin panel.
    """
    
    # Fields to display in the list view
    list_display = ['id', 'user', 'item_name', 'quantity', 'price', 'total', 'created_at']
    
    # Fields to filter by in the sidebar
    list_filter = ['user', 'created_at']
    
    # Fields to search
    search_fields = ['item_name', 'user__username']
    
    # Read-only fields (calculated automatically)
    readonly_fields = ['total', 'created_at', 'updated_at']
    
    # Default ordering (newest first)
    ordering = ['-created_at']
