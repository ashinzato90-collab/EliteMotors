// Credenciales de administrador (en producción esto debería estar en un servidor)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'elite2024'
};

// Precios aproximados de los vehículos (por día)
const CAR_PRICES = {
    'Lamborghini Huracán': 8500,
    'Ferrari 488 GTB': 9200,
    'Rolls Royce Phantom': 7800,
    'Bentley Continental GT': 6900,
    'Porsche 911 Turbo S': 7200,
    'Range Rover Autobiography': 5500,
    'Mercedes G-Wagon AMG': 6200,
    'Aston Martin DB11': 8800,
    'Maserati Quattroporte': 5900,
    'BMW X7 M50i': 4800,
    'McLaren 720S': 9500,
    'Cadillac Escalade': 4200
};

let allReservations = [];
let currentReservation = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    setupLoginForm();
    loadReservations();
    setupEventListeners();
});

// Verificar si hay sesión activa
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

// Configurar formulario de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminName', username);
            showDashboard();
            showNotification('Bienvenido, Administrador', 'success');
        } else {
            showNotification('Usuario o contraseña incorrectos', 'error');
        }
    });
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('adminName').textContent = 
        sessionStorage.getItem('adminName') || 'Administrador';
    
    loadReservations();
    updateStats();
}

// Cerrar sesión
function logout() {
    if (confirm('')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminName');
        location.reload();
    }
}

// Cargar reservas desde sessionStorage
function loadReservations() {
    try {
        const stored = sessionStorage.getItem('reservations');
        if (stored) {
            allReservations = JSON.parse(stored);
        } else {
            allReservations = generateSampleData();
        }
    } catch (e) {
        allReservations = generateSampleData();
    }
    
    displayReservations(allReservations);
    updateStats();
}

// Generar datos de ejemplo (para demostración)
function generateSampleData() {
    const sampleData = [
        {
            id: Date.now() - 86400000,
            name: '',
            email: '',
            phone: '',
            carType: '',
            date: '',
            message: '',
            submittedAt: new Date(Date.now() - 86400000).toLocaleString('es-MX')
        },
        {
            id: Date.now() - 172800000,
            name: '',
            email: '',
            phone: '',
            carType: '',
            date: '',
            message: '',
            submittedAt: new Date(Date.now() - 172800000).toLocaleString('es-MX')
        },
        {
            id: Date.now() - 259200000,
            name: '',
            email: '',
            phone: '',
            carType: '',
            date: '',
            message: '',
            submittedAt: new Date(Date.now() - 259200000).toLocaleString('es-MX')
        }
    ];
    
    return sampleData;
}

// Mostrar reservas en la tabla
function displayReservations(reservations) {
    const tbody = document.getElementById('reservationsBody');
    const noData = document.getElementById('noData');
    
    if (!reservations || reservations.length === 0) {
        tbody.innerHTML = '';
        noData.style.display = 'block';
        return;
    }
    
    noData.style.display = 'none';
    
    tbody.innerHTML = reservations.map(res => `
        <tr>
            <td><strong>#${res.id}</strong></td>
            <td>${formatDate(res.date)}</td>
            <td>${res.name}</td>
            <td>${res.email}</td>
            <td>${res.phone}</td>
            <td><strong>${res.carType}</strong></td>
            <td>${res.message ? (res.message.substring(0, 30) + '...') : '-'}</td>
            <td>${res.submittedAt}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" onclick="viewDetails(${res.id})">👁️ Ver</button>
                    <button class="btn-delete" onclick="deleteReservation(${res.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Actualizar estadísticas
function updateStats() {
    // Total de reservas
    document.getElementById('totalReservations').textContent = allReservations.length;
    
    // Reservas de hoy
    const today = new Date().toISOString().split('T')[0];
    const todayCount = allReservations.filter(r => {
        const resDate = new Date(r.submittedAt).toISOString().split('T')[0];
        return resDate === today;
    }).length;
    document.getElementById('todayReservations').textContent = todayCount;
    
    // Auto más popular
    const carCounts = {};
    allReservations.forEach(r => {
        carCounts[r.carType] = (carCounts[r.carType] || 0) + 1;
    });
    
    let popularCar = '-';
    let maxCount = 0;
    for (let car in carCounts) {
        if (carCounts[car] > maxCount) {
            maxCount = carCounts[car];
            popularCar = car;
        }
    }
    
    // Mostrar solo las primeras palabras si es muy largo
    const carShortName = popularCar.split(' ').slice(0, 2).join(' ');
    document.getElementById('popularCar').textContent = carShortName;
    
    // Ingresos estimados
    let totalRevenue = 0;
    allReservations.forEach(r => {
        const price = CAR_PRICES[r.carType] || 5000;
        totalRevenue += price;
    });
    
    document.getElementById('estimatedRevenue').textContent = 
        `$${totalRevenue.toLocaleString('es-MX')}`;
}

// Ver detalles de una reserva
function viewDetails(id) {
    const reservation = allReservations.find(r => r.id === id);
    if (!reservation) return;
    
    currentReservation = reservation;
    
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    const price = CAR_PRICES[reservation.carType] || 5000;
    
    modalBody.innerHTML = `
        <p><strong>ID de Reserva:</strong> #${reservation.id}</p>
        <p><strong>Cliente:</strong> ${reservation.name}</p>
        <p><strong>Email:</strong> ${reservation.email}</p>
        <p><strong>Teléfono:</strong> ${reservation.phone}</p>
        <p><strong>Vehículo:</strong> ${reservation.carType}</p>
        <p><strong>Precio/día:</strong> $${price.toLocaleString('es-MX')}</p>
        <p><strong>Fecha de Renta:</strong> ${formatDate(reservation.date)}</p>
        ${reservation.message ? `<p><strong>Mensaje:</strong> ${reservation.message}</p>` : ''}
        <p><strong>Solicitud enviada:</strong> ${reservation.submittedAt}</p>
    `;
    
    modal.style.display = 'block';
}

// Eliminar reserva
function deleteReservation(id) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;
    
    allReservations = allReservations.filter(r => r.id !== id);
    saveReservations();
    displayReservations(allReservations);
    updateStats();
    showNotification('Reserva eliminada correctamente', 'success');
}

// Guardar reservas en sessionStorage
function saveReservations() {
    try {
        sessionStorage.setItem('reservations', JSON.stringify(allReservations));
    } catch (e) {
        console.error('Error al guardar reservas:', e);
    }
}

// Contactar cliente
function contactClient() {
    if (!currentReservation) return;
    
    const subject = encodeURIComponent(`Reserva de ${currentReservation.carType}`);
    const body = encodeURIComponent(`Hola ${currentReservation.name},

Gracias por tu interés en rentar nuestro ${currentReservation.carType}.

Nos pondremos en contacto contigo pronto.

Saludos,
Elite Motors`);
    
    window.open(`mailto:${currentReservation.email}?subject=${subject}&body=${body}`);
}

// Descargar PDF de la reserva
function downloadReservationPDF() {
    if (!currentReservation) return;
    
    const price = CAR_PRICES[currentReservation.carType] || 5000;
    
    const content = `
═══════════════════════════════════════════════
          ELITE MOTORS - RENTA DE AUTOS DE LUJO
═══════════════════════════════════════════════

DETALLES DE LA RESERVA

ID de Reserva: #${currentReservation.id}

INFORMACIÓN DEL CLIENTE
─────────────────────────────────────────────
Nombre:    ${currentReservation.name}
Email:     ${currentReservation.email}
Teléfono:  ${currentReservation.phone}

DETALLES DEL VEHÍCULO
─────────────────────────────────────────────
Vehículo:  ${currentReservation.carType}
Precio:    $${price.toLocaleString('es-MX')} MXN / día
Fecha:     ${formatDate(currentReservation.date)}

${currentReservation.message ? `MENSAJE DEL CLIENTE
─────────────────────────────────────────────
${currentReservation.message}
` : ''}
INFORMACIÓN DE LA SOLICITUD
─────────────────────────────────────────────
Fecha de solicitud: ${currentReservation.submittedAt}

═══════════════════════════════════════════════
           www.elitemotors.mx
      Av. Presidente Masaryk 111, Polanco
         +52 55 1234 5678
═══════════════════════════════════════════════
    `.trim();
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reserva-${currentReservation.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Archivo descargado', 'success');
}

// Exportar a CSV
function exportToCSV() {
    if (allReservations.length === 0) {
        showNotification('No hay datos para exportar', 'error');
        return;
    }
    
    const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Vehículo', 'Fecha Renta', 'Mensaje', 'Fecha Solicitud'];
    const rows = allReservations.map(r => [
        r.id,
        r.name,
        r.email,
        r.phone,
        r.carType,
        r.date,
        r.message || '',
        r.submittedAt
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('CSV exportado correctamente', 'success');
}

// Exportar a Excel (formato HTML que Excel puede abrir)
function exportToExcel() {
    if (allReservations.length === 0) {
        showNotification('No hay datos para exportar', 'error');
        return;
    }
    
    let excelContent = `
        <table border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Vehículo</th>
                    <th>Precio/día</th>
                    <th>Fecha Renta</th>
                    <th>Mensaje</th>
                    <th>Fecha Solicitud</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    allReservations.forEach(r => {
        const price = CAR_PRICES[r.carType] || 5000;
        excelContent += `
            <tr>
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>${r.email}</td>
                <td>${r.phone}</td>
                <td>${r.carType}</td>
                <td>$${price.toLocaleString('es-MX')}</td>
                <td>${r.date}</td>
                <td>${r.message || ''}</td>
                <td>${r.submittedAt}</td>
            </tr>
        `;
    });
    
    excelContent += `
            </tbody>
        </table>
    `;
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-${Date.now()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Excel exportado correctamente', 'success');
}

// Limpiar todos los datos
function clearAllData() {
    if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODAS las reservas. ¿Estás seguro?')) return;
    if (!confirm('¿Realmente estás seguro? Esta acción no se puede deshacer.')) return;
    
    allReservations = [];
    saveReservations();
    displayReservations(allReservations);
    updateStats();
    showNotification('Todos los datos han sido eliminados', 'success');
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = allReservations.filter(r => 
            r.name.toLowerCase().includes(query) ||
            r.email.toLowerCase().includes(query) ||
            r.phone.includes(query) ||
            r.carType.toLowerCase().includes(query)
        );
        displayReservations(filtered);
    });
    
    // Filtro de fecha
    const filterDate = document.getElementById('filterDate');
    filterDate.addEventListener('change', function() {
        const filter = this.value;
        let filtered = allReservations;
        
        if (filter !== 'all') {
            const now = new Date();
            filtered = allReservations.filter(r => {
                const resDate = new Date(r.submittedAt);
                
                if (filter === 'today') {
                    return resDate.toDateString() === now.toDateString();
                } else if (filter === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return resDate >= weekAgo;
                } else if (filter === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return resDate >= monthAgo;
                }
                return true;
            });
        }
        
        displayReservations(filtered);
    });
    
    // Cerrar modal
    const modal = document.getElementById('detailModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Mostrar notificación
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
            notification.style.background = '#d4af37';
            notification.style.color = '#1a1a1a';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Recargar reservas periódicamente (cada 30 segundos)
setInterval(() => {
    const currentSearch = document.getElementById('searchInput').value;
    if (!currentSearch) {
        loadReservations();
    }
}, 30000);

console.log('✅ Panel de Administración cargado');
console.log('🔐 Credenciales: admin / elite2024');