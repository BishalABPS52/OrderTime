from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create/', views.create_order, name='create_order'),
    path('quantity/', views.quantity_view, name='quantity'),
    path('orders/', views.order_list, name='order_list'),
    path('update/<int:id>/', views.update_order, name='update_order'),
    path('delete/<int:id>/', views.delete_order, name='delete_order'),
]
