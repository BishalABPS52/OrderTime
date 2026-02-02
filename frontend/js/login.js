// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Simple validation (for demo - in production, use backend)
            if (username === 'admin' && password === 'admin') {
                alert('✅ Login successful! Welcome to Restaurant Orders');
                window.location.href = 'menu.html';
            } else if (username === '' || password === '') {
                alert('❌ Please enter both username and password');
            } else {
                alert('❌ Invalid credentials. Use admin/admin for demo');
            }
        });
    }
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
