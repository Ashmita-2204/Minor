document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hodReviewForm');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'specific_recommendations[]') {
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });
        
        // Here you would typically send the data to a server
        console.log('Form data:', data);
        
        // Show success message
        alert('Review submitted successfully!');
        form.reset();
    });
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Check overall assessment
        if (!form.assessment.value) {
            alert('Please select an overall assessment');
            isValid = false;
        }
        
        // Check recommendation
        if (!form.recommendation.value) {
            alert('Please select a recommendation');
            isValid = false;
        }
        
        // Check comments
        if (!form.comments.value.trim()) {
            alert('Please provide comments');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Save draft functionality (example)
    const saveDraftBtn = document.querySelector('.btn-outline-secondary');
    saveDraftBtn.addEventListener('click', function() {
        // In a real application, this would save to local storage or send to server
        console.log('Draft saved');
        alert('Draft saved successfully');
    });
    
    // Additional interactive elements could be added here
});