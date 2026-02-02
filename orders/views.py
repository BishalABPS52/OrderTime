from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

from .models import MenuItem, Order
from .forms import OrderForm


# ==================== AUTHENTICATION ====================

def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('menu')

    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ==================== MENU ====================

@login_required
def menu(request):
    items = MenuItem.objects.all()
    return render(request, 'menu.html', {'items': items})


# ==================== CRUD (ORDERS) ====================

@login_required
def create_order(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.save()
            return redirect('order_list')
    else:
        form = OrderForm()

    return render(request, 'order.html', {'form': form})


@login_required
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'order_list.html', {'orders': orders})


@login_required
def update_order(request, id):
    order = get_object_or_404(Order, id=id, user=request.user)
    form = OrderForm(request.POST or None, instance=order)

    if form.is_valid():
        form.save()
        return redirect('order_list')

    return render(request, 'order.html', {'form': form})


@login_required
def delete_order(request, id):
    order = get_object_or_404(Order, id=id, user=request.user)
    order.delete()
    return redirect('order_list')
