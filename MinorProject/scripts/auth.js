// Authentication functions
const auth = {
    currentUser: null,
    
    login: function(role, credentials) {
        // In a real app, this would call an API
        this.currentUser = {
            id: 'user123',
            name: 'Faculty Member',
            role: role,
            department: 'Computer Science'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Redirect based on role
        switch(role) {
            case 'faculty':
                window.location.href = 'faculty-dashboard.html';
                break;
            case 'hod':
                window.location.href = 'hod-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
        }
    },
    
    logout: function() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    },
    
    checkAuth: function() {
        const user = localStorage.getItem('currentUser');
        if(user) {
            this.currentUser = JSON.parse(user);
            return true;
        }
        return false;
    },
    
    getCurrentUser: function() {
        return this.currentUser;
    }
};

// Event Listeners for login buttons
document.addEventListener('DOMContentLoaded', function() {
    // Login buttons on main page
    if(document.getElementById('login-btn')) {
        document.getElementById('login-btn').addEventListener('click', function() {
            auth.login('faculty', {});
        });
        
        document.getElementById('hod-btn').addEventListener('click', function() {
            auth.login('hod', {});
        });
        
        document.getElementById('admin-btn').addEventListener('click', function() {
            auth.login('admin', {});
        });
    }
    
    // Logout buttons
    const logoutButtons = document.querySelectorAll('[id$="-logout"], #logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            auth.logout();
        });
    });
    
    // Check if user is authenticated on dashboard pages
    if(window.location.pathname.includes('dashboard')) {
        if(!auth.checkAuth()) {
            window.location.href = 'index.html';
        }
    }
});