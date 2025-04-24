document.addEventListener('DOMContentLoaded', function() {
    // Sample faculty data (in a real app, this would come from an API)
    const facultyData = [
        { id: 1, name: "Dr. Sarah Johnson", designation: "Professor", score: 62, recommendation: "Promotion" },
        { id: 2, name: "Dr. Michael Chen", designation: "Associate Professor", score: 78, recommendation: "Award" },
        { id: 3, name: "Dr. Emily Wilson", designation: "Assistant Professor", score: 85, recommendation: "Promotion" },
        { id: 4, name: "Dr. Robert Brown", designation: "Professor", score: 54, recommendation: "FDP" },
        { id: 5, name: "Dr. Lisa Taylor", designation: "Associate Professor", score: 67, recommendation: "Promotion" },
        { id: 6, name: "Dr. David Miller", designation: "Assistant Professor", score: 72, recommendation: "Award" },
        { id: 7, name: "Dr. Jennifer Davis", designation: "Professor", score: 58, recommendation: "FDP" },
        { id: 8, name: "Dr. James Anderson", designation: "Associate Professor", score: 81, recommendation: "Promotion" },
        { id: 9, name: "Dr. Patricia Thomas", designation: "Assistant Professor", score: 65, recommendation: "FDP" },
        { id: 10, name: "Dr. Richard White", designation: "Professor", score: 49, recommendation: "Improvement" },
        { id: 11, name: "Dr. Susan Martin", designation: "Associate Professor", score: 76, recommendation: "Award" },
        { id: 12, name: "Dr. Charles Clark", designation: "Assistant Professor", score: 69, recommendation: "Promotion" }
    ];

    // Sort faculty by score in increasing order
    facultyData.sort((a, b) => a.score - b.score);

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    const tableBody = document.getElementById('facultyTableBody');
    const pagination = document.getElementById('pagination');

    // Function to render table rows
    function renderTable(page = 1) {
        currentPage = page;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = facultyData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        paginatedData.forEach((faculty, index) => {
            const row = document.createElement('tr');
            const rank = startIndex + index + 1;
            
            // Determine performance level
            let performanceLevel, badgeClass;
            if (faculty.score >= 80) {
                performanceLevel = 'Excellent';
                badgeClass = 'bg-excellent';
            } else if (faculty.score >= 70) {
                performanceLevel = 'Good';
                badgeClass = 'bg-good';
            } else if (faculty.score >= 60) {
                performanceLevel = 'Average';
                badgeClass = 'bg-average';
            } else if (faculty.score >= 50) {
                performanceLevel = 'Poor';
                badgeClass = 'bg-poor';
            } else {
                performanceLevel = 'Unsatisfactory';
                badgeClass = 'bg-unsatisfactory';
            }

            row.innerHTML = `
                <td>${rank}</td>
                <td>${faculty.name}</td>
                <td>${faculty.designation}</td>
                <td>${faculty.score}</td>
                <td><span class="badge ${badgeClass}">${performanceLevel}</span></td>
                <td>${faculty.recommendation}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-details" data-id="${faculty.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary ms-1" onclick="window.location.href='review_form.html?id=${faculty.id}'">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to view buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const facultyId = this.getAttribute('data-id');
                viewFacultyDetails(facultyId);
            });
        });
    }

    // Function to render pagination
    function renderPagination() {
        const totalPages = Math.ceil(facultyData.length / itemsPerPage);
        pagination.innerHTML = '';

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
        prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) renderTable(currentPage - 1);
        });
        pagination.appendChild(prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                renderTable(i);
            });
            pagination.appendChild(li);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
        nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) renderTable(currentPage + 1);
        });
        pagination.appendChild(nextLi);
    }

    // Function to view faculty details (placeholder)
    function viewFacultyDetails(facultyId) {
        const faculty = facultyData.find(f => f.id == facultyId);
        alert(`Viewing details for:\n\nName: ${faculty.name}\nScore: ${faculty.score}\nRecommendation: ${faculty.recommendation}`);
    }

    // Items per page change handler
    document.getElementById('itemsPerPage').addEventListener('change', function() {
        renderTable(1);
        renderPagination();
    });

    // Export CSV button
    document.querySelector('.btn-outline-primary').addEventListener('click', function() {
        exportToCSV();
    });

    // Function to export data as CSV
    function exportToCSV() {
        let csv = 'Rank,Name,Designation,Score,Performance Level,Recommendation\n';
        
        facultyData.forEach((faculty, index) => {
            let performanceLevel;
            if (faculty.score >= 80) performanceLevel = 'Excellent';
            else if (faculty.score >= 70) performanceLevel = 'Good';
            else if (faculty.score >= 60) performanceLevel = 'Average';
            else if (faculty.score >= 50) performanceLevel = 'Poor';
            else performanceLevel = 'Unsatisfactory';

            csv += `${index + 1},"${faculty.name}","${faculty.designation}",${faculty.score},"${performanceLevel}","${faculty.recommendation}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'faculty_performance_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Initial render
    renderTable();
    renderPagination();
});