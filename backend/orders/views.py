from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import datetime
import json

# In-memory storage (will reset when server restarts)
USERS = {
    'admin': 'admin',  # username: password
    'user': 'user'
}

MENU_ITEMS = [
    # Tea & Coffee
    {'id': 1, 'name': 'Black Tea', 'price': 10, 'category': 'Tea & Coffee'},
    {'id': 2, 'name': 'Milk Tea', 'price': 20, 'category': 'Tea & Coffee'},
    {'id': 3, 'name': 'Black Coffee', 'price': 30, 'category': 'Tea & Coffee'},
    {'id': 4, 'name': 'Milk Coffee', 'price': 40, 'category': 'Tea & Coffee'},
    
    # Breakfast
    {'id': 5, 'name': 'Bread & Tea', 'price': 50, 'category': 'Breakfast'},
    {'id': 6, 'name': 'Sel Roti', 'price': 30, 'category': 'Breakfast'},
    {'id': 7, 'name': 'Chana', 'price': 40, 'category': 'Breakfast'},
    {'id': 8, 'name': 'Boiled Egg', 'price': 20, 'category': 'Breakfast'},
    
    # Snacks
    {'id': 9, 'name': 'Laphing', 'price': 60, 'category': 'Snacks'},
    {'id': 10, 'name': 'Buff. Momo', 'price': 100, 'category': 'Snacks'},
    {'id': 11, 'name': 'Veg. Momo', 'price': 80, 'category': 'Snacks'},
    {'id': 12, 'name': 'Chicken Momo', 'price': 120, 'category': 'Snacks'},
    {'id': 13, 'name': 'BURGER', 'price': 150, 'category': 'Snacks'},
    {'id': 14, 'name': 'Small Pizza', 'price': 200, 'category': 'Snacks'},
    {'id': 15, 'name': 'Large Pizza', 'price': 350, 'category': 'Snacks'},
    
    # Lunch & Dinner
    {'id': 16, 'name': 'Veg. Khana', 'price': 150, 'category': 'Lunch & Dinner'},
    {'id': 17, 'name': 'Chicken Khana', 'price': 200, 'category': 'Lunch & Dinner'},
    {'id': 18, 'name': 'Mutton Khana', 'price': 250, 'category': 'Lunch & Dinner'},
    
    # Curry
    {'id': 19, 'name': 'Veg. Curry', 'price': 100, 'category': 'Curry'},
    {'id': 20, 'name': 'Egg Curry', 'price': 120, 'category': 'Curry'},
    {'id': 21, 'name': 'Chicken Curry', 'price': 180, 'category': 'Curry'},
    {'id': 22, 'name': 'Mutton Curry', 'price': 220, 'category': 'Curry'},
    
    # Bread & Rotis
    {'id': 23, 'name': 'Normal Bread', 'price': 15, 'category': 'Bread & Rotis'},
    {'id': 24, 'name': 'Roti', 'price': 20, 'category': 'Bread & Rotis'},
    {'id': 25, 'name': 'Naan', 'price': 30, 'category': 'Bread & Rotis'},
    {'id': 26, 'name': 'Butter Naan', 'price': 40, 'category': 'Bread & Rotis'},
    
    # Cold Drinks
    {'id': 27, 'name': 'Coca Cola', 'price': 50, 'category': 'Cold Drinks'},
    {'id': 28, 'name': 'Pepsi', 'price': 50, 'category': 'Cold Drinks'},
    {'id': 29, 'name': 'Sprite', 'price': 50, 'category': 'Cold Drinks'},
    {'id': 30, 'name': 'Mountain Dew', 'price': 50, 'category': 'Cold Drinks'},
]

ORDERS = []
order_id_counter = 1


def home_view(request):
    """Homepage with OrderTime welcome message and Place Order button"""
    return render(request, 'home.html')


def quantity_view(request):
    """Quantity adjustment page"""
    return render(request, 'quantity.html')


def create_order(request):
    username = 'Guest'
    
    if request.method == 'POST':
        global order_id_counter
        
        try:
            item_name = request.POST.get('item_name')
            quantity = int(request.POST.get('quantity', 1))
            price = float(request.POST.get('price', 0))
            
            if item_name and quantity > 0 and price > 0:
                order = {
                    'id': order_id_counter,
                    'username': username,
                    'item_name': item_name,
                    'price': price,
                    'quantity': quantity,
                    'total': price * quantity,
                    'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                ORDERS.append(order)
                order_id_counter += 1
                
                return JsonResponse({'success': True, 'order_id': order['id']})
            else:
                return JsonResponse({'success': False, 'error': 'Invalid data'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    # For GET requests, return menu items
    return render(request, 'order.html', {
        'menu_items': MENU_ITEMS,
        'username': username
    })


def order_list(request):
    username = 'Guest'
    
    # Get only current user's orders
    user_orders = [order for order in ORDERS if order['username'] == username]
    
    # Calculate grand total
    grand_total = sum(order['total'] for order in user_orders)
    
    # Return HTML template
    return render(request, 'order_list.html', {
        'orders': user_orders,
        'username': username,
        'grand_total': grand_total
    })


def update_order(request, id):
    username = 'Guest'
    
    # Find order
    order = next((o for o in ORDERS if o['id'] == id and o['username'] == username), None)
    
    if not order:
        return redirect('order_list')
    
    if request.method == 'POST':
        item_id = int(request.POST.get('item'))
        quantity = int(request.POST.get('quantity'))
        
        # Find menu item
        menu_item = next((item for item in MENU_ITEMS if item['id'] == item_id), None)
        
        if menu_item and quantity > 0:
            order['item_id'] = item_id
            order['item_name'] = menu_item['name']
            order['item_price'] = menu_item['price']
            order['quantity'] = quantity
            order['total_price'] = menu_item['price'] * quantity
            return redirect('order_list')
    
    return render(request, 'order.html', {
        'menu_items': MENU_ITEMS,
        'order': order,
        'username': username
    })


def delete_order(request, id):
    username = 'Guest'
    
    # Remove order if it belongs to current user
    global ORDERS
    ORDERS = [o for o in ORDERS if not (o['id'] == id and o['username'] == username)]
    
    return redirect('order_list')


def logout_view(request):
    """Logout view - clears session data and redirects to login"""
    # Clear all orders for Guest user
    global ORDERS
    ORDERS = [o for o in ORDERS if o['username'] != 'Guest']
    
    # Redirect to login page
    return redirect('login')


def login_view(request):
    """Login page"""
    return render(request, 'login.html')
