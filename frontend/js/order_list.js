// Order list page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add confirmation to delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const confirmDelete = confirm('Are you sure you want to delete this order?');
            if (!confirmDelete) {
                e.preventDefault();
                return false;
            }
        });
    });
});

