"""
Order model for restaurant order management.

This model stores orders placed by logged-in users.
Each order belongs to a specific user via ForeignKey.
"""

from django.db import models
from django.contrib.auth.models import User


class Order(models.Model):
    """
    Model representing a single order item.
    
    Fields:
    - user: The user who placed the order (ForeignKey to Django's User model)
    - item_name: Name of the item ordered (e.g., "Black Tea", "Chicken Momo")
    - price: Price per unit of the item
    - quantity: Number of items ordered
    - total: Total price (price * quantity) - automatically calculated
    - created_at: Timestamp when order was created
    - updated_at: Timestamp when order was last updated
    """
    
    # Link order to a user - when user is deleted, their orders are also deleted
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,  # Delete orders when user is deleted
        related_name='orders'  # Access user's orders via user.orders.all()
    )
    
    # Order details
    item_name = models.CharField(max_length=200)  # Name of the item
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price per unit
    quantity = models.PositiveIntegerField(default=1)  # Number of items (must be >= 1)
    total = models.DecimalField(max_digits=10, decimal_places=2)  # Total price
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)  # Set when order is created
    updated_at = models.DateTimeField(auto_now=True)  # Updated whenever order is modified
    
    class Meta:
        # Orders should be displayed newest first
        ordering = ['-created_at']
    
    def __str__(self):
        """String representation of the order"""
        return f"Order #{self.id} - {self.user.username}: {self.item_name} x{self.quantity}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to automatically calculate total.
        This ensures total is always correct when order is created or updated.
        """
        self.total = self.price * self.quantity
        super().save(*args, **kwargs)
