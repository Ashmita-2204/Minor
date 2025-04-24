class AppraisalForm {
    constructor() {
        this.form = document.getElementById('appraisalForm');
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Load saved draft if exists
        this.loadDraft();
        
        // Form submission handler
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Save draft button
        const saveDraftBtn = document.getElementById('save-draft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', this.saveDraft.bind(this));
        }
    }
    
    serializeForm() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Handle arrays for table data
        const arrayFields = ['course-code', 'course-title', 'course-level', 'semester', 'students', 
                            'paper-title', 'paper-journal', 'paper-indexing', 'paper-year', 'paper-doi'];
        
        formData.forEach((value, key) => {
            // Check if this is part of an array field
            if (key.endsWith('[]')) {
                const fieldName = key.replace('[]', '');
                if (!data[fieldName]) {
                    data[fieldName] = [];
                }
                data[fieldName].push(value);
            } else {
                // Handle checkboxes
                if (key.startsWith('teaching-innovations') || key.startsWith('training-needs')) {
                    if (!data[key]) {
                        data[key] = [];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
        });
        
        return data;
    }
    
    saveDraft() {
        const formData = this.serializeForm();
        localStorage.setItem('appraisalDraft', JSON.stringify(formData));
        
        // Show success message
        this.showToast('Draft saved successfully!', 'success');
    }
    
    loadDraft() {
        const savedDraft = localStorage.getItem('appraisalDraft');
        if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            this.populateForm(draftData);
            
            // Show draft loaded message
            this.showToast('Draft loaded successfully!', 'info');
        }
    }
    
    populateForm(data) {
        // Populate simple fields
        Object.keys(data).forEach(key => {
            const element = this.form.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key].includes(element.value);
                } else {
                    element.value = data[key];
                }
            }
        });
        
        // Populate table data (simplified example for courses)
        if (data['course-code'] && data['course-code'].length > 1) {
            const table = document.getElementById('courses-taught');
            const tbody = table.querySelector('tbody');
            
            // Clear existing rows (keep first row)
            while (tbody.querySelectorAll('tr').length > 1) {
                tbody.lastChild.remove();
            }
            
            // Add additional rows
            for (let i = 1; i < data['course-code'].length; i++) {
                const addBtn = document.querySelector('.add-row[data-table="courses-taught"]');
                addBtn.click();
                
                const lastRow = tbody.lastChild;
                lastRow.querySelector('[name="course-code[]"]').value = data['course-code'][i];
                lastRow.querySelector('[name="course-title[]"]').value = data['course-title'][i];
                // ... populate other fields similarly
            }
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.serializeForm();
        
        // In a real app, you would send this to a server
        console.log('Form submitted:', formData);
        localStorage.setItem('appraisalSubmission', JSON.stringify(formData));
        localStorage.removeItem('appraisalDraft');
        
        // Show success message
        this.showToast('Appraisal submitted successfully!', 'success');
        
        // Redirect or show confirmation
        setTimeout(() => {
            window.location.href = 'submission-confirmation.html';
        }, 1500);
    }
    
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AppraisalForm();
});