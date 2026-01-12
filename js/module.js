// js/module.js

// Simple module functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Module Latihan dimuat...');
    
    // Add form submission handler
    const form = document.getElementById('pendaftaranForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const inputs = this.querySelectorAll('input, select');
            const name = inputs[0].value;
            const jawatan = inputs[1].value;
            const jabatan = inputs[2].value;
            
            if (!name || !jawatan || !jabatan) {
                alert('Sila isi semua maklumat staff');
                return;
            }
            
            // Add to table
            addStaffToTable(name, jawatan, jabatan);
            
            // Clear form
            inputs.forEach(input => {
                if (input.tagName === 'INPUT') input.value = '';
                if (input.tagName === 'SELECT') input.selectedIndex = 0;
            });
            
            // Show message
            showModuleMessage(`Staff "${name}" berjaya didaftarkan`, 'success');
        });
    }
    
    // Setup delete buttons
    setupDeleteButtons();
});

// Add staff to table
function addStaffToTable(name, jawatan, jabatan) {
    const tbody = document.getElementById('staffList');
    if (!tbody) return;
    
    // Get next row number
    const rowCount = tbody.querySelectorAll('tr').length + 1;
    
    // Create new row
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${rowCount}</td>
        <td>${name}</td>
        <td>${jawatan}</td>
        <td>${jabatan}</td>
        <td>
            <button class="btn btn-sm btn-danger" onclick="deleteStaffRow(this)">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Setup delete buttons for existing rows
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('#staffList .btn-danger');
    deleteButtons.forEach(button => {
        button.onclick = function() {
            deleteStaffRow(this);
        };
    });
}

// Delete staff row
function deleteStaffRow(button) {
    const row = button.closest('tr');
    const name = row.cells[1].textContent;
    
    if (confirm(`Adakah anda pasti ingin padam ${name}?`)) {
        row.remove();
        
        // Update row numbers
        updateRowNumbers();
        
        showModuleMessage(`Staff "${name}" telah dipadam`, 'warning');
    }
}

// Update row numbers after deletion
function updateRowNumbers() {
    const tbody = document.getElementById('staffList');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Show message in module
function showModuleMessage(message, type) {
    // Remove existing message
    const existing = document.getElementById('moduleMessage');
    if (existing) existing.remove();
    
    // Create message
    const messageDiv = document.createElement('div');
    messageDiv.id = 'moduleMessage';
    messageDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    messageDiv.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert after the staff section
    const staffSection = document.querySelector('.staff-section');
    if (staffSection) {
        staffSection.appendChild(messageDiv);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Make functions available globally
window.deleteStaffRow = deleteStaffRow;
