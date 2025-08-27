// Simulated database (replace with Firebase or similar in production)
let textbooks = JSON.parse(localStorage.getItem('textbooks')) || [];

// Show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// Handle form submission
document.getElementById('textbookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookId = document.getElementById('bookId').value;
    const studentName = document.getElementById('studentName').value;
    const condition = document.getElementById('condition').value;

    textbooks.push({ bookId, studentName, condition });
    localStorage.setItem('textbooks', JSON.stringify(textbooks));

    document.getElementById('confirmation').innerText = `Textbook ${bookId} for ${studentName} recorded as ${condition}.`;
    this.reset();
    updateReport();
});

// Update admin report table
function updateReport() {
    const reportBody = document.getElementById('reportBody');
    reportBody.innerHTML = '';
    textbooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.bookId}</td><td>${book.studentName}</td><td>${book.condition}</td>`;
        reportBody.appendChild(row);
    });
    updateChart();
}

// Generate condition breakdown chart
function updateChart() {
    const conditions = ['New', 'Good', 'Acceptable', 'Damaged', 'Lost'];
    const counts = conditions.map(condition => 
        textbooks.filter(book => book.condition === condition).length
    );

    new Chart(document.getElementById('conditionChart'), {
        type: 'bar',
        data: {
            labels: conditions,
            datasets: [{
                label: 'Textbook Conditions',
                data: counts,
                backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6c757d']
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Generate Damaged & Lost report
function generateDamagedLostReport() {
    const damagedLost = textbooks.filter(book => 
        book.condition === 'Damaged' || book.condition === 'Lost'
    );
    const reportDiv = document.getElementById('damagedLostReport');
    reportDiv.innerHTML = '<h4>Damaged & Lost Books</h4>';
    if (damagedLost.length === 0) {
        reportDiv.innerHTML += '<p>No damaged or lost books.</p>';
        return;
    }
    const ul = document.createElement('ul');
    damagedLost.forEach(book => {
        const li = document.createElement('li');
        li.innerText = `Book ID: ${book.bookId}, Student: ${book.studentName}, Condition: ${book.condition}`;
        ul.appendChild(li);
    });
    reportDiv.appendChild(ul);
}

// Initialize report on page load
updateReport();
