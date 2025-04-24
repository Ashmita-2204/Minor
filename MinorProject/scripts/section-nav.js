// // Form section navigation
// class SectionNavigator {
//     constructor() {
//         this.currentSection = 0;
//         this.sections = document.querySelectorAll('.form-section');
//         this.navLinks = document.querySelectorAll('#section-nav a');
//         this.init();
//     }
    
//     init() {
//         // Show first section by default
//         this.showSection(0);
        
//         // Next/previous button handlers
//         document.querySelectorAll('.next-section').forEach(btn => {
//             btn.addEventListener('click', () => this.nextSection());
//         });
        
//         document.querySelectorAll('.prev-section').forEach(btn => {
//             btn.addEventListener('click', () => this.prevSection());
//         });
        
//         // Nav link handlers
//         this.navLinks.forEach((link, index) => {
//             link.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 this.showSection(index);
//             });
//         });
//     }
    
//     showSection(index) {
//         // Validate index
//         if (index < 0 || index >= this.sections.length) return;
        
//         // Hide all sections
//         this.sections.forEach(section => {
//             section.classList.remove('active');
//         });
        
//         // Show selected section
//         this.sections[index].classList.add('active');
//         this.currentSection = index;
        
//         // Update nav links
//         this.navLinks.forEach(link => {
//             link.classList.remove('active');
//         });
//         this.navLinks[index].classList.add('active');
        
//         // Scroll to top of section
//         this.sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
    
//     nextSection() {
//         // Validate current section before proceeding
//         if (!this.validateCurrentSection()) return;
        
//         this.showSection(this.currentSection + 1);
//     }
    
//     prevSection() {
//         this.showSection(this.currentSection - 1);
//     }
    
//     validateCurrentSection() {
//         const currentSection = this.sections[this.currentSection];
//         const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
        
//         let isValid = true;
        
//         inputs.forEach(input => {
//             if (!input.value.trim()) {
//                 input.classList.add('error');
//                 isValid = false;
                
//                 // Scroll to first error
//                 if (isValid === false) {
//                     input.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                     input.focus();
//                 }
//             } else {
//                 input.classList.remove('error');
//             }
//         });
        
//         if (!isValid) {
//             alert('Please fill all required fields before proceeding.');
//         }
        
//         return isValid;
//     }
// }

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     new SectionNavigator();
    
//     // Add row functionality for tables
//     document.querySelectorAll('.add-row').forEach(button => {
//         button.addEventListener('click', function() {
//             const tableId = this.getAttribute('data-table');
//             const table = document.getElementById(tableId);
//             const tbody = table.querySelector('tbody');
//             const newRow = tbody.querySelector('tr').cloneNode(true);
            
//             // Clear input values in new row
//             newRow.querySelectorAll('input').forEach(input => {
//                 input.value = '';
//             });
            
//             tbody.appendChild(newRow);
            
//             // Add event listener to new remove button
//             newRow.querySelector('.remove-row').addEventListener('click', function() {
//                 if (tbody.querySelectorAll('tr').length > 1) {
//                     this.closest('tr').remove();
//                 } else {
//                     alert('At least one row is required.');
//                 }
//             });
//         });
//     });
    
//     // Remove row functionality
//     document.querySelectorAll('.remove-row').forEach(button => {
//         button.addEventListener('click', function() {
//             const tbody = this.closest('tbody');
//             if (tbody.querySelectorAll('tr').length > 1) {
//                 this.closest('tr').remove();
//             } else {
//                 alert('At least one row is required.');
//             }
//         });
//     });
// });

class SectionNavigator {
    constructor() {
        this.currentSection = 0;
        this.sections = document.querySelectorAll('.form-section');
        this.navLinks = document.querySelectorAll('#section-nav a');
        this.form = document.getElementById('appraisalForm');
        this.progressBar = document.getElementById('form-progress');
        this.progressText = document.getElementById('progress-text');
        this.toast = new bootstrap.Toast(document.getElementById('form-toast'));
        
        this.init();
    }
    
    init() {
        // Show first section by default
        this.showSection(0);
        this.updateProgress();
        
        // Next/previous button handlers
        document.querySelectorAll('.next-section').forEach(btn => {
            btn.addEventListener('click', () => this.nextSection());
        });
        
        document.querySelectorAll('.prev-section').forEach(btn => {
            btn.addEventListener('click', () => this.prevSection());
        });
        
        // Nav link handlers
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (index < this.currentSection || this.validateCurrentSection()) {
                    this.showSection(index);
                }
            });
        });
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateCurrentSection()) {
                    this.showToast('Appraisal submitted successfully!', 'bg-success');
                    // In real app, submit to server
                    console.log('Form submitted:', this.serializeForm());
                }
            });
        }
    }
    
    showSection(index) {
        // Validate index
        if (index < 0 || index >= this.sections.length) return;
        
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        this.sections[index].classList.add('active');
        this.currentSection = index;
        
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        this.navLinks[index].classList.add('active');
        
        // Update progress
        this.updateProgress();
        
        // Scroll to top of section
        this.sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    nextSection() {
        if (this.validateCurrentSection()) {
            this.showSection(this.currentSection + 1);
        }
    }
    
    prevSection() {
        this.showSection(this.currentSection - 1);
    }
    
    validateCurrentSection() {
        const currentSection = this.sections[this.currentSection];
        const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
                
                // Scroll to first error
                if (isValid === false) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus();
                }
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill all required fields before proceeding.', 'bg-danger');
        }
        
        return isValid;
    }
    
    updateProgress() {
        const progress = Math.round(((this.currentSection + 1) / this.sections.length) * 100);
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${progress}% Complete`;
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
    
    showToast(message, bgClass) {
        const toast = document.getElementById('form-toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast align-items-center text-white ${bgClass}`;
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const sectionNav = new SectionNavigator();
    
    // Add row functionality for tables
    document.querySelectorAll('.add-row').forEach(button => {
        button.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table');
            const table = document.getElementById(tableId);
            const tbody = table.querySelector('tbody');
            const newRow = tbody.querySelector('tr').cloneNode(true);
            
            // Clear input values in new row
            newRow.querySelectorAll('input').forEach(input => {
                input.value = '';
                input.classList.remove('is-invalid');
            });
            
            // Clear select values
            newRow.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });
            
            tbody.appendChild(newRow);
            
            // Add event listener to new remove button
            newRow.querySelector('.remove-row').addEventListener('click', function() {
                if (tbody.querySelectorAll('tr').length > 1) {
                    this.closest('tr').remove();
                } else {
                    sectionNav.showToast('At least one row is required.', 'bg-warning');
                }
            });
        });
    });
    
    // Remove row functionality
    document.querySelectorAll('.remove-row').forEach(button => {
        button.addEventListener('click', function() {
            const tbody = this.closest('tbody');
            if (tbody.querySelectorAll('tr').length > 1) {
                this.closest('tr').remove();
            } else {
                const toast = new bootstrap.Toast(document.getElementById('form-toast'));
                document.getElementById('toast-message').textContent = 'At least one row is required.';
                document.getElementById('form-toast').className = 'toast align-items-center text-white bg-warning';
                toast.show();
            }
        });
    });
    
    // Save draft button
    document.getElementById('save-draft')?.addEventListener('click', function() {
        const formData = sectionNav.serializeForm();
        localStorage.setItem('appraisalDraft', JSON.stringify(formData));
        sectionNav.showToast('Draft saved successfully!', 'bg-info');
    });
    
    // Load draft if exists
    const savedDraft = localStorage.getItem('appraisalDraft');
    if (savedDraft && sectionNav.form) {
        const draftData = JSON.parse(savedDraft);
        
        // Populate form fields
        Object.keys(draftData).forEach(key => {
            const element = sectionNav.form.querySelector(`[name="${key}"]`) || 
                            sectionNav.form.querySelector(`[name="${key}[]"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = draftData[key].includes(element.value);
                } else if (element.type === 'radio') {
                    element.checked = (element.value === draftData[key]);
                } else {
                    element.value = draftData[key];
                }
            }
        });
        
        sectionNav.showToast('Draft loaded successfully!', 'bg-info');
    }
});