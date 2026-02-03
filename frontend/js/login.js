// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Check if already logged in
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        window.location.href = 'home.html';
        return;
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Validate inputs
            if (username === '' || password === '') {
                alert('❌ Please enter both username and password');
                return;
            }
            
            // Call login API
            fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Login response:', data);
                if (data.success) {
                    alert('✅ Login successful! Welcome ' + data.user.username);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('sessionId', Date.now().toString());
                    window.location.href = 'home.html';
                } else {
                    alert('❌ ' + (data.error || 'Login failed'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('❌ Login failed. Please try again.');
            });
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
