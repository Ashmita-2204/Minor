// Main application logic
class App {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkUserRole();
    }
    
    setupEventListeners() {
        // Auto-save draft every 30 seconds
        if(document.getElementById('appraisalForm')) {
            setInterval(() => {
                const form = document.getElementById('appraisalForm');
                const formData = new FormData(form);
                const data = {};
                
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                
                localStorage.setItem('draftAppraisal', JSON.stringify(data));
                console.log('Draft saved');
            }, 30000);
        }
    }
    
    checkUserRole() {
        const auth = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const currentPage = window.location.pathname.split('/').pop();
        
        // Redirect if user tries to access wrong dashboard
        if(auth.role === 'faculty' && !currentPage.includes('faculty')) {
            window.location.href = 'faculty-dashboard.html';
        } else if(auth.role === 'hod' && !currentPage.includes('hod')) {
            window.location.href = 'hod-dashboard.html';
        } 
        // else if(auth.role === 'admin' && !currentPage.includes('admin')) {
        //     window.location.href = 'admin-dashboard.html';
        // }
        
        // Display user info
        if(document.getElementById('user-info')) {
            document.getElementById('user-info').textContent = 
                `Logged in as ${auth.name} (${auth.department})`;
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    new App();
});