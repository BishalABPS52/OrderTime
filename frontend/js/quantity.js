// Quantity page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    // Load pending order from sessionStorage
    const pendingOrder = JSON.parse(sessionStorage.getItem('pendingOrder') || '[]');
    
    if (pendingOrder.length === 0) {
        alert('No items in cart. Redirecting to order page...');
        window.location.href = 'order.html';
        return;
    }
    
    // Build order items HTML
    const orderItemsContainer = document.querySelector('.order-items');
    orderItemsContainer.innerHTML = '';
    
    pendingOrder.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.dataset.itemId = item.id;
        itemRow.dataset.itemPrice = item.price;
        itemRow.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">Rs. ${item.price}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn minus">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99">
                <button class="qty-btn plus">+</button>
            </div>
            <div class="item-total">
                <span class="total-label">Total:</span>
                <span class="total-price">Rs. ${item.price * item.quantity}</span>
            </div>
            <button class="btn-remove" title="Remove item">×</button>
        `;
        orderItemsContainer.appendChild(itemRow);
    });
    
    const itemRows = document.querySelectorAll('.item-row');
    
    // Update item total and grand total
    function updateTotals() {
        let grandTotal = 0;
        
        itemRows.forEach(row => {
            const priceText = row.querySelector('.item-price').textContent;
            const price = parseFloat(priceText.replace('Rs. ', ''));
            const qtyInput = row.querySelector('.qty-input');
            const quantity = parseInt(qtyInput.value) || 1;
            const itemTotal = price * quantity;
            
            row.querySelector('.total-price').textContent = 'Rs. ' + itemTotal;
            grandTotal += itemTotal;
        });
        
        document.getElementById('subtotal').textContent = 'Rs. ' + grandTotal;
        document.getElementById('grandTotal').textContent = 'Rs. ' + grandTotal;
    }
    
    // Handle plus/minus buttons
    itemRows.forEach(row => {
        const qtyInput = row.querySelector('.qty-input');
        const plusBtn = row.querySelector('.plus');
        const minusBtn = row.querySelector('.minus');
        const removeBtn = row.querySelector('.btn-remove');
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value) || 1;
            if (value < 99) {
                qtyInput.value = value + 1;
                updateTotals();
            }
        });
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value) || 1;
            if (value > 1) {
                qtyInput.value = value - 1;
                updateTotals();
            }
        });
        
        qtyInput.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            if (value < 1) this.value = 1;
            if (value > 99) this.value = 99;
            updateTotals();
        });
        
        removeBtn.addEventListener('click', function() {
            if (confirm('Remove this item from your order?')) {
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    row.remove();
                    updateTotals();
                    
                    // Check if no items left
                    if (document.querySelectorAll('.item-row').length === 0) {
                        alert('No items in cart. Redirecting to order page...');
                        window.location.href = 'order.html';
                    }
                }, 300);
            }
        });
    });
    
    // Finalize order button
    document.getElementById('btnFinalize').addEventListener('click', function() {
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const itemId = row.dataset.itemId;
            const name = row.querySelector('.item-name').textContent;
            const qty = parseInt(row.querySelector('.qty-input').value);
            const price = parseFloat(row.dataset.itemPrice);
            items.push({ id: itemId, name, quantity: qty, price });
        });
        
        if (items.length === 0) {
            alert('No items to order!');
            return;
        }
        
        console.log('Finalizing orders:', items);
        
        // Send each item to backend API
        const orderPromises = items.map(item => {
            console.log('Creating order:', item);
            return fetch('http://localhost:8000/api/orders/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    item_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                return data;
            });
        });
        
        Promise.all(orderPromises)
            .then(results => {
                console.log('All results:', results);
                // Check if all orders succeeded
                const allSuccess = results.every(result => result.id || result.success !== false);
                if (allSuccess) {
                    sessionStorage.removeItem('pendingOrder');
                    alert('Orders placed successfully!');
                    window.location.href = 'order_list.html';
                } else {
                    console.error('Some orders failed:', results);
                    // Check if any failed due to auth
                    const hasAuthError = results.some(result => result.error && result.error.includes('Authentication'));
                    if (hasAuthError) {
                        localStorage.clear();
                        alert('Session expired. Please login again.');
                        window.location.href = 'login.html';
                    } else {
                        alert('Some orders failed. Please try again.');
                    }
                }
            })
            .catch(error => {
                console.error('Error placing orders:', error);
                localStorage.clear();
                alert('Failed to place orders. Please login again.');
                window.location.href = 'login.html';
            });
    });
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Initial total calculation
    updateTotals();
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
