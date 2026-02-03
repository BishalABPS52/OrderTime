document.addEventListener('DOMContentLoaded', function() {
    console.log('Restaurant Order Management System loaded');
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        // Redirect to login if not logged in and not on login page
        window.location.href = 'login.html';
        return;
    }
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle (if needed)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                fetch('http://localhost:8000/api/logout/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    // Clear all stored data
                    localStorage.clear();
                    sessionStorage.clear();
                    alert('Logged out successfully');
                    window.location.href = 'login.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Clear anyway and redirect
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                });
            }
        });
    }
    
    // Display username if stored
    const usernameDisplay = document.getElementById('usernameDisplay');
    const storedUsername = localStorage.getItem('username');
    if (usernameDisplay && storedUsername) {
        usernameDisplay.textContent = 'Welcome, ' + storedUsername;
    }
});
