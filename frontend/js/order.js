// Order form JavaScript - Calculate total price dynamically for multiple items
document.addEventListener('DOMContentLoaded', function() {
    const itemCheckboxes = document.querySelectorAll('input[name="item"]');
    const totalPriceDisplay = document.getElementById('totalPrice');
    const selectedItemsDisplay = document.getElementById('selectedItems');
    const orderForm = document.getElementById('orderForm');
    
    // Calculate total price for all selected items
    function calculateTotal() {
        if (!totalPriceDisplay || !selectedItemsDisplay) return;
        
        const selectedItems = document.querySelectorAll('input[name="item"]:checked');
        let total = 0;
        selectedItemsDisplay.innerHTML = '';
        
        selectedItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const name = item.dataset.name;
            total += price;
            
            // Add selected item to display
            const itemTag = document.createElement('span');
            itemTag.className = 'selected-item';
            itemTag.textContent = `${name} - Rs. ${price}`;
            selectedItemsDisplay.appendChild(itemTag);
        });
        
        totalPriceDisplay.textContent = 'Rs. ' + total;
        totalPriceDisplay.style.color = total > 0 ? '#667eea' : '#999';
        
        // Add pulse animation
        if (total > 0) {
            totalPriceDisplay.style.animation = 'none';
            setTimeout(() => {
                totalPriceDisplay.style.animation = 'pulse 0.5s ease';
            }, 10);
        }
    }
    
    // Add event listeners to all checkboxes
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
    
    // Form validation
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedItems = document.querySelectorAll('input[name="item"]:checked');
            
            if (selectedItems.length === 0) {
                alert('Please select at least one menu item');
                return false;
            }
            
            // Collect selected items with quantities
            const orderData = [];
            selectedItems.forEach(item => {
                orderData.push({
                    id: item.value,
                    name: item.dataset.name,
                    price: parseFloat(item.dataset.price),
                    quantity: 1  // Default quantity, will be adjusted on quantity page
                });
            });
            
            // Store in sessionStorage and redirect to quantity page
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
            window.location.href = 'quantity.html';
        });
    }
    
    // Helper function to get CSRF token from cookies
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
    
    // Calculate initial total on page load
    calculateTotal();
    
    // Add animation to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.opacity = '0';
            group.style.transform = 'translateX(-20px)';
            group.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
});
