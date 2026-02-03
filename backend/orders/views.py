from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import Order
from decimal import Decimal




@api_view(['POST'])
@csrf_exempt
def login_api(request): 
    # Get username and password from request
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Validate that both fields are provided
    if not username or not password:
        return Response(
            {
                'success': False,
                'error': 'Username and password are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user using Django's built-in authentication
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        # User credentials are valid - create a session
        login(request, user)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username
            }
        })
    else:
        # Invalid credentials
        return Response(
            {
                'success': False,
                'error': 'Invalid username or password'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@csrf_exempt
def logout_api(request):
    logout(request)
    return Response({
        'success': True,
        'message': 'Logout successful'
    })


@api_view(['POST'])
@csrf_exempt
def create_order_api(request):
    # Check if user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required. Please login first.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get data from request
    item_name = request.data.get('item_name')
    price = request.data.get('price')
    quantity = request.data.get('quantity')
    
    # Validate required fields
    if not item_name or not price or not quantity:
        return Response(
            {'error': 'Missing required fields: item_name, price, quantity'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate data types and values
    try:
        price = Decimal(str(price))
        quantity = int(quantity)
        
        if price <= 0:
            return Response(
                {'error': 'Price must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if quantity < 1:
            return Response(
                {'error': 'Quantity must be at least 1'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid price or quantity format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create the order
    order = Order.objects.create(
        user=request.user,
        item_name=item_name,
        price=price,
        quantity=quantity
    )
    
    # Return order data
    return Response({
        'id': order.id,
        'username': order.user.username,
        'item_name': order.item_name,
        'price': str(order.price),
        'quantity': order.quantity,
        'total': str(order.total),
        'created_at': order.created_at.isoformat(),
        'updated_at': order.updated_at.isoformat()
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def my_orders_api(request):
    # Check if user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required. Please login first.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get only the logged-in user's orders
    orders = Order.objects.filter(user=request.user)
    
    # Convert orders to list of dictionaries
    orders_data = []
    grand_total = Decimal('0')
    
    for order in orders:
        orders_data.append({
            'id': order.id,
            'username': order.user.username,
            'item_name': order.item_name,
            'price': str(order.price),
            'quantity': order.quantity,
            'total': str(order.total),
            'created_at': order.created_at.isoformat(),
            'updated_at': order.updated_at.isoformat()
        })
        grand_total += order.total
    
    return Response({
        'orders': orders_data,
        'grand_total': str(grand_total)
    })


@api_view(['PUT'])
@csrf_exempt
def edit_order_api(request, id):    
    # Check if user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required. Please login first.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Try to get the order - must belong to the logged-in user
    try:
        order = Order.objects.get(id=id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found or you don\'t have permission to edit it.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get data from request
    item_name = request.data.get('item_name')
    price = request.data.get('price')
    quantity = request.data.get('quantity')
    
    # Validate required fields
    if not item_name or not price or not quantity:
        return Response(
            {'error': 'Missing required fields: item_name, price, quantity'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate data types and values
    try:
        price = Decimal(str(price))
        quantity = int(quantity)
        
        if price <= 0:
            return Response(
                {'error': 'Price must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if quantity < 1:
            return Response(
                {'error': 'Quantity must be at least 1'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid price or quantity format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Update the order
    order.item_name = item_name
    order.price = price
    order.quantity = quantity
    order.save()
    
    # Return updated order data
    return Response({
        'id': order.id,
        'username': order.user.username,
        'item_name': order.item_name,
        'price': str(order.price),
        'quantity': order.quantity,
        'total': str(order.total),
        'created_at': order.created_at.isoformat(),
        'updated_at': order.updated_at.isoformat()
    })


@api_view(['DELETE'])
@csrf_exempt
def delete_order_api(request, id):
    # Check if user is authenticated
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required. Please login first.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Try to get the order - must belong to the logged-in user
    try:
        order = Order.objects.get(id=id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found or you don\'t have permission to delete it.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Delete the order
    order.delete()
    
    return Response({
        'success': True,
        'message': 'Order deleted successfully'
    })
