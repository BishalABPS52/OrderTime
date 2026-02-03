"""
URL Configuration for Orders App.

This file maps URLs to their corresponding API view functions.
All API endpoints are prefixed with /api/ in the main urls.py
"""

from django.urls import path
from . import views

# API URL patterns
urlpatterns = [
    # Authentication APIs
    path('login/', views.login_api, name='login_api'),
    path('logout/', views.logout_api, name='logout_api'),
    
    # Order Management APIs
    path('orders/create/', views.create_order_api, name='create_order_api'),
    path('orders/my/', views.my_orders_api, name='my_orders_api'),
    path('orders/edit/<int:id>/', views.edit_order_api, name='edit_order_api'),
    path('orders/delete/<int:id>/', views.delete_order_api, name='delete_order_api'),
]
