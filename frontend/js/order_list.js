// Order list page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    loadOrders();
});

function loadOrders() {
    console.log('Loading orders from backend...');
    
    // Fetch orders from API
    fetch('http://localhost:8000/api/orders/my/', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        console.log('Orders response status:', response.status);
        if (response.status === 401) {
            // Session expired, clear localStorage and redirect
            localStorage.clear();
            alert('Session expired. Please login again.');
            window.location.href = 'login.html';
            return Promise.reject('Unauthorized');
        }
        return response.json();
    })
    .then(data => {
        console.log('Orders data:', data);
        
        if (data.error) {
            localStorage.clear();
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }
        
        displayOrders(data.orders, data.grand_total);
    })
    .catch(error => {
        if (error !== 'Unauthorized') {
            console.error('Error loading orders:', error);
            alert('Failed to load orders. Please try again.');
        }
    });
}

function displayOrders(orders, grandTotal) {
    const tableBody = document.getElementById('ordersTableBody');
    const totalOrdersSpan = document.getElementById('totalOrders');
    const grandTotalSpan = document.getElementById('grandTotal');
    
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No orders yet. <a href="order.html">Place your first order</a>
                </td>
            </tr>
        `;
        totalOrdersSpan.textContent = '0';
        grandTotalSpan.textContent = 'Rs. 0';
        return;
    }
    
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.item_name}</td>
            <td>${order.quantity}</td>
            <td>Rs. ${order.price}</td>
            <td class="total-price">Rs. ${order.total}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-delete" data-order-id="${order.id}">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update summary
    totalOrdersSpan.textContent = orders.length;
    grandTotalSpan.textContent = `Rs. ${grandTotal}`;
    
    // Add delete functionality
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            if (confirm('Are you sure you want to delete this order?')) {
                deleteOrder(orderId);
            }
        });
    });
}

function deleteOrder(orderId) {
    fetch(`http://localhost:8000/api/orders/delete/${orderId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order deleted successfully');
            loadOrders(); // Reload orders
        } else {
            alert('Failed to delete order: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete order');
    });
}

