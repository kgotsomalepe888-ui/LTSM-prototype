// Simulated database
let textbooks = JSON.parse(localStorage.getItem('textbooks')) || [];
let isLoggedIn = false;

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'password123') { // Simple auth (replace with secure method)
        isLoggedIn = true;
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        updateDashboard();
    } else {
        alert('Invalid credentials');
    }
});

function logout() {
    isLoggedIn = false;
    document.getElementById('app').style.display = 'none';
    document.getElementById('login').style.display = 'flex';
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    if (sectionId === 'dashboard') updateDashboard();
}

document.getElementById('textbookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookId = document.getElementById('bookId').value;
    const studentName = document.getElementById('studentName').value;
    const condition = document.getElementById('condition').value;

    textbooks.push({ bookId, studentName, condition });
    localStorage.setItem('textbooks', JSON.stringify(textbooks));
    document.getElementById('confirmation').innerText = `Textbook ${bookId} for ${studentName} recorded as ${condition}.`;
    this.reset();
    if (isLoggedIn) updateDashboard();
});

function updateDashboard() {
    document.getElementById('totalBooks').innerText = textbooks.length;
    document.getElementById('damagedLost').innerText = textbooks.filter(b => b.condition === 'Damaged' || b.condition === 'Lost').length;

    const reportBody = document.getElementById('reportBody');
    reportBody.innerHTML = '';
    textbooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${book.bookId}</td><td>${book.studentName}</td><td>${book.condition}</td>`;
        reportBody.appendChild(row);
    });

    new Chart(document.getElementById('conditionChart'), {
        type: 'bar',
        data: {
            labels: ['New', 'Good', 'Acceptable', 'Damaged', 'Lost'],
            datasets: [{
                label: 'Textbook Conditions',
                data: ['New', 'Good', 'Acceptable', 'Damaged', 'Lost'].map(c => textbooks.filter(b => b.condition === c).length),
                backgroundColor: ['#28a745', '#6cc070', '#b3e0b3', '#ff6f61', '#ffd700']
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function generateDamagedLostReport() {
    const damagedLost = textbooks.filter(book => book.condition === 'Damaged' || book.condition === 'Lost');
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

// Initial load
if (isLoggedIn) {
    document.getElementById('app').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    updateDashboard();
                                  }
