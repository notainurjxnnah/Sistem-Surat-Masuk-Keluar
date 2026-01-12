// js/dashboard.js

// Initialize Data
let staffData = [];
let suratData = [];

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Sistem Latihan dimuat...');
    
    // Load data from localStorage or use default
    loadData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome message
    showAlert('Sistem Latihan Jabatan - Dashboard sedia digunakan', 'info');
});

// Load data function
function loadData() {
    // Try to load from localStorage
    const savedStaff = localStorage.getItem('latihanStaffData');
    const savedSurat = localStorage.getItem('latihanSuratData');
    
    if (savedStaff) {
        staffData = JSON.parse(savedStaff);
    } else {
        // Default staff data
        staffData = [
            {
                id: 1,
                name: "Ahmad bin Abdullah",
                jawatan: "Penolong Pengarah",
                jabatan: "ICT",
                kursus: "Kursus Kepimpinan Strategik",
                tarikh: "2024-01-15",
                status: "Aktif"
            },
            {
                id: 2,
                name: "Siti Nurhaliza binti Mohd",
                jawatan: "Pegawai Tadbir",
                jabatan: "HR",
                kursus: "Latihan ICT Lanjutan",
                tarikh: "2024-01-20",
                status: "Aktif"
            },
            {
                id: 3,
                name: "Mohanraj a/l Subramaniam",
                jawatan: "Penganalisis Sistem",
                jabatan: "ICT",
                kursus: "Bengkel Komunikasi",
                tarikh: "2024-01-10",
                status: "Aktif"
            }
        ];
        saveStaffData();
    }
    
    if (savedSurat) {
        suratData = JSON.parse(savedSurat);
    } else {
        // Default surat data
        suratData = [
            {
                id: 1,
                rujukan: "JLP/2024/LTN/001",
                kursus: "Kursus Kepimpinan Strategik",
                tarikh: "15 Jan 2024",
                status: "Dihantar"
            },
            {
                id: 2,
                rujukan: "JLP/2024/LTN/002",
                kursus: "Latihan ICT Lanjutan",
                tarikh: "20 Jan 2024",
                status: "Dihantar"
            },
            {
                id: 3,
                rujukan: "JLP/2024/LTN/003",
                kursus: "Bengkel Komunikasi",
                tarikh: "25 Jan 2024",
                status: "Dalam Proses"
            }
        ];
        saveSuratData();
    }
    
    // Display data
    displaySuratData();
    displayStaffData();
    
    // Setup checkbox listeners
    setupCheckboxListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Registration form
    const daftarForm = document.getElementById('daftarForm');
    if (daftarForm) {
        daftarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerStaff();
        });
    }
    
    // Sort by bulan
    const sortBulan = document.getElementById('sortBulan');
    if (sortBulan) {
        sortBulan.addEventListener('change', function() {
            sortStaffByBulan(this.value);
        });
    }
    
    // Sort by nama
    const sortNama = document.getElementById('sortNama');
    if (sortNama) {
        sortNama.addEventListener('click', function() {
            sortStaffByNama();
        });
    }
}

// Setup checkbox listeners for staff selection
function setupCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.staff-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedStaff);
    });
}

// Update selected staff display
function updateSelectedStaff() {
    const selectedDiv = document.getElementById('staffTerpilih');
    const selected = Array.from(document.querySelectorAll('.staff-checkbox:checked'))
                         .map(cb => cb.value);
    
    if (selected.length === 0) {
        selectedDiv.innerHTML = '<span class="text-muted">Tiada staff dipilih</span>';
        return;
    }
    
    selectedDiv.innerHTML = '';
    selected.forEach((staff, index) => {
        const div = document.createElement('div');
        div.className = 'staff-item';
        div.innerHTML = `
            <span>${index + 1}. ${staff}</span>
            <button type="button" class="btn btn-sm btn-outline-danger" 
                    onclick="removeSelectedStaff('${staff}')">
                <i class="bi bi-x"></i>
            </button>
        `;
        selectedDiv.appendChild(div);
    });
}

// Remove selected staff
function removeSelectedStaff(staffName) {
    const checkbox = Array.from(document.querySelectorAll('.staff-checkbox'))
                        .find(cb => cb.value === staffName);
    if (checkbox) {
        checkbox.checked = false;
        updateSelectedStaff();
    }
}

// Register staff function
function registerStaff() {
    const kursusSelect = document.getElementById('pilihKursus');
    const kursusText = kursusSelect.options[kursusSelect.selectedIndex].text;
    
    if (kursusSelect.value === "") {
        showAlert('Sila pilih kursus terlebih dahulu', 'warning');
        return;
    }
    
    const selectedStaff = Array.from(document.querySelectorAll('.staff-checkbox:checked'))
                              .map(cb => cb.value);
    
    if (selectedStaff.length === 0) {
        showAlert('Sila pilih sekurang-kurangnya seorang staff', 'warning');
        return;
    }
    
    // Add each selected staff to staffData
    selectedStaff.forEach(staffName => {
        const newStaff = {
            id: Date.now() + Math.random(), // Unique ID
            name: staffName,
            jawatan: "Pegawai",
            jabatan: getDepartmentFromName(staffName),
            kursus: kursusText,
            tarikh: new Date().toISOString().split('T')[0],
            status: "Baru"
        };
        
        staffData.push(newStaff);
    });
    
    // Save to localStorage
    saveStaffData();
    
    // Refresh display
    displayStaffData();
    
    // Reset form
    document.querySelectorAll('.staff-checkbox').forEach(cb => cb.checked = false);
    updateSelectedStaff();
    kursusSelect.value = "";
    
    // Show success message
    showAlert(`${selectedStaff.length} staff berjaya didaftarkan untuk ${kursusText}`, 'success');
}

// Helper: Get department from name (simplified)
function getDepartmentFromName(name) {
    if (name.includes('Ahmad')) return 'ICT';
    if (name.includes('Siti')) return 'HR';
    if (name.includes('Mohan')) return 'ICT';
    if (name.includes('Nor')) return 'Kewangan';
    if (name.includes('Wong')) return 'Pentadbiran';
    return 'Umum';
}

// Display surat data
function displaySuratData() {
    const tbody = document.getElementById('suratTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (suratData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-envelope-x me-2"></i>
                    Tiada surat latihan
                </td>
            </tr>
        `;
        return;
    }
    
    suratData.forEach((surat, index) => {
        const row = document.createElement('tr');
        const statusClass = surat.status === 'Dihantar' ? 'success' : 
                           surat.status === 'Dalam Proses' ? 'warning' : 'secondary';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${surat.rujukan}</strong></td>
            <td>${surat.kursus}</td>
            <td>${surat.tarikh}</td>
            <td><span class="badge bg-${statusClass}">${surat.status}</span></td>
            <td>
                <a href="module-latihan.html?surat=${surat.id}" target="_blank" 
                   class="btn btn-sm btn-outline-primary">
                   <i class="bi bi-eye me-1"></i> Lihat
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display staff data
function displayStaffData() {
    const tbody = document.getElementById('staffTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (staffData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-people me-2"></i>
                    Tiada staff didaftarkan
                </td>
            </tr>
        `;
        return;
    }
    
    staffData.forEach((staff, index) => {
        const row = document.createElement('tr');
        const tarikh = new Date(staff.tarikh);
        const bulan = tarikh.toLocaleDateString('ms-MY', { month: 'long' });
        const tarikhFormatted = tarikh.toLocaleDateString('ms-MY');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${staff.name}</strong></td>
            <td>${staff.jawatan}</td>
            <td><span class="badge bg-info">${staff.jabatan}</span></td>
            <td>${staff.kursus}</td>
            <td>${tarikhFormatted}<br><small class="text-muted">(${bulan})</small></td>
            <td><span class="badge bg-${staff.status === 'Aktif' ? 'success' : 'warning'}">
                ${staff.status}
            </span></td>
        `;
        tbody.appendChild(row);
    });
}

// Sort staff by bulan
function sortStaffByBulan(bulan) {
    if (!bulan) {
        displayStaffData();
        return;
    }
    
    const filtered = staffData.filter(staff => {
        const staffBulan = new Date(staff.tarikh).getMonth() + 1;
        return staffBulan.toString().padStart(2, '0') === bulan;
    });
    
    displayFilteredStaff(filtered);
}

// Sort staff by nama
function sortStaffByNama() {
    const sorted = [...staffData].sort((a, b) => 
        a.name.localeCompare(b.name, 'ms')
    );
    
    displayFilteredStaff(sorted);
    showAlert('Data disusun mengikut nama (A-Z)', 'info');
}

// Display filtered staff
function displayFilteredStaff(data) {
    const tbody = document.getElementById('staffTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    Tiada data dijumpai
                </td>
            </tr>
        `;
        return;
    }
    
    data.forEach((staff, index) => {
        const row = document.createElement('tr');
        const tarikh = new Date(staff.tarikh);
        const bulan = tarikh.toLocaleDateString('ms-MY', { month: 'long' });
        const tarikhFormatted = tarikh.toLocaleDateString('ms-MY');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${staff.name}</strong></td>
            <td>${staff.jawatan}</td>
            <td><span class="badge bg-info">${staff.jabatan}</span></td>
            <td>${staff.kursus}</td>
            <td>${tarikhFormatted}<br><small class="text-muted">(${bulan})</small></td>
            <td><span class="badge bg-${staff.status === 'Aktif' ? 'success' : 'warning'}">
                ${staff.status}
            </span></td>
        `;
        tbody.appendChild(row);
    });
}

// Save staff data to localStorage
function saveStaffData() {
    localStorage.setItem('latihanStaffData', JSON.stringify(staffData));
}

// Save surat data to localStorage
function saveSuratData() {
    localStorage.setItem('latihanSuratData', JSON.stringify(suratData));
}

// Refresh data function
function refreshData() {
    loadData();
    showAlert('Data telah dikemas kini', 'info');
}

// Show alert message
function showAlert(message, type) {
    // Remove existing alerts
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();
    
    // Create alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} custom-alert alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 
                      type === 'warning' ? 'bi-exclamation-triangle' : 
                      type === 'danger' ? 'bi-x-circle' : 'bi-info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Make functions available globally
window.refreshData = refreshData;
window.removeSelectedStaff = removeSelectedStaff;
