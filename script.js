/* ========================================
   ELITE MOTORS - SCRIPT.JS
   ======================================== */

// ========================================
// BASE DE DATOS DE AUTOS
// ========================================
// IMPORTANTE: Reemplaza las URLs de las imágenes con las rutas de tus propias imágenes
const cars = [
    {
        id: 1,
        name: 'Lamborghini',
        model: 'Urus',
        category: 'suv',
        price: 'S/3,370',
        power: '650 HP',
        speed: '305 km/h',
        transmission: 'Automática 8 vel',
        traction: '4WD',
        acceleration: '3.6 segundos',
        description: 'El SUV más rápido del mundo. Una combinación perfecta de lujo italiano, rendimiento deportivo y versatilidad. Ideal para quienes buscan destacar sin renunciar al confort y la elegancia.',
        image: 'lambo-urus-blue.jpg' // CAMBIA ESTA RUTA por tu imagen
    },
    {
        id: 2,
        name: 'Audi',
        model: 'R8',
        category: 'deportivo',
        price: 'S/2,700',
        power: '562 HP',
        speed: '329 km/h',
        transmission: 'Automática 7 vel',
        traction: 'AWD',
        acceleration: '3.4 segundos',
        description: 'Puro rendimiento alemán. El Audi R8 combina tecnología de punta con un diseño agresivo y elegante. Motor V10 que ofrece una experiencia de conducción incomparable.',
        image: 'audi-r8-white.jpg' // CAMBIA ESTA RUTA por tu imagen
    },
    
];

// ========================================
// VARIABLES GLOBALES
// ========================================
let currentFilter = 'all';

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    renderCars();
    setupForm();
    setMinDate();
    console.log('✅ Elite Motors - Sistema inicializado');
    console.log(`🚗 ${cars.length} vehículos cargados`);
}

// ========================================
// FUNCIONES DE RENDERIZADO
// ========================================

// Renderizar autos en el grid
function renderCars() {
    const grid = document.getElementById('carsGrid');
    const filtered = currentFilter === 'all' 
        ? cars 
        : cars.filter(car => car.category === currentFilter);
    
    grid.innerHTML = filtered.map(car => `
        <div class="car-card" onclick="showCarDetail(${car.id})">
            <div class="car-image">
                <img src="${car.image}" 
                     alt="${car.name} ${car.model}" 
                     onerror="this.parentElement.innerHTML='<div class=\\'car-image-placeholder\\'>🚗</div>'">
            </div>
            <div class="car-info">
                <h3>${car.name} ${car.model}</h3>
                <div class="car-category">${car.category}</div>
                <div class="car-specs">
                    <span>⚡ ${car.power}</span>
                    <span>🏁 ${car.speed}</span>
                </div>
                <div class="car-price">${car.price} <span>/ día</span></div>
                <button class="view-details-btn">Ver Detalles y Reservar</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// FUNCIONES DE FILTRADO
// ========================================

function filterCars(category) {
    currentFilter = category;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Renderizar autos filtrados
    renderCars();
}

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

function showPage(page) {
    const homePage = document.getElementById('homePage');
    const detailPage = document.getElementById('detailPage');
    
    if (page === 'home') {
        homePage.style.display = 'block';
        detailPage.classList.remove('active');
    } else {
        homePage.style.display = 'none';
        detailPage.classList.add('active');
    }
}

function scrollToFleet() {
    showPage('home');
    setTimeout(() => {
        document.getElementById('fleet').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

function scrollToContact() {
    showPage('home');
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// ========================================
// PÁGINA DE DETALLE
// ========================================

function showCarDetail(id) {
    const car = cars.find(c => c.id === id);
    if (!car) return;

    const detailPage = document.getElementById('detailPage');
    detailPage.innerHTML = `
        <div class="detail-hero">
            <div class="detail-container">
                <div class="detail-image">
                    <img src="${car.image}" 
                         alt="${car.name} ${car.model}" 
                         onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:5rem;color:var(--gold)\\'>🚗</div>'">
                </div>
                <div class="detail-info">
                    <h1>${car.name} <span>${car.model}</span></h1>
                    <div class="detail-price">${car.price}/día</div>
                    <p class="detail-description">${car.description}</p>
                    
                    <h3 style="margin-bottom: 1rem; color: var(--dark);">Especificaciones</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <strong>Motor</strong>
                            ${car.transmission}
                        </div>
                        <div class="spec-item">
                            <strong>Potencia</strong>
                            ${car.power}
                        </div>
                        <div class="spec-item">
                            <strong>0-100 km/h</strong>
                            ${car.acceleration}
                        </div>
                        <div class="spec-item">
                            <strong>Velocidad Máx.</strong>
                            ${car.speed}
                        </div>
                        <div class="spec-item">
                            <strong>Transmisión</strong>
                            ${car.transmission}
                        </div>
                        <div class="spec-item">
                            <strong>Tracción</strong>
                            ${car.traction}
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <button class="reserve-btn" onclick="reserveFromDetail('${car.name} ${car.model}')">Reservar Ahora</button>
                        <button class="back-btn" onclick="showPage('home')">← Volver a la Flota</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    showPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function reserveFromDetail(carName) {
    scrollToContact();
    
    // Pre-llenar el select con el auto seleccionado
    setTimeout(() => {
        const carSelect = document.getElementById('carType');
        if (carSelect) {
            for (let option of carSelect.options) {
                if (option.text === carName) {
                    option.selected = true;
                    break;
                }
            }
        }
    }, 500);
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

function setupForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            carType: document.getElementById('carType').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('es-MX')
        };
        
        // Mostrar en consola
        console.log('===== NUEVA RESERVA =====');
        console.log('Nombre:', formData.name);
        console.log('Email:', formData.email);
        console.log('Teléfono:', formData.phone);
        console.log('Vehículo:', formData.carType);
        console.log('Fecha:', formData.date);
        console.log('Mensaje:', formData.message);
        console.log('Enviado:', formData.timestamp);
        console.log('========================');
        
        // Mostrar notificación de éxito
        showNotification(
            '¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.',
            '#28a745'
        );
        
        // Limpiar formulario
        form.reset();
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

function showNotification(message, color) {
    // Remover notificaciones anteriores
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => notif.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.background = color;
    
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Para agregar nuevos autos fácilmente
function addCar(carData) {
    cars.push({
        id: cars.length + 1,
        ...carData
    });
    renderCars();
    console.log(`✅ Nuevo auto agregado: ${carData.name} ${carData.model}`);
}

// Ejemplo de uso:
// addCar({
//     name: 'McLaren',
//     model: '720S',
//     category: 'deportivo',
//     price: '$9,500',
//     power: '720 HP',
//     speed: '341 km/h',
//     transmission: 'Automática 7 vel',
//     traction: 'RWD',
//     acceleration: '2.9 segundos',
//     description: 'Superdeportivo británico...',
//     image: 'img/mclaren-720s.jpg'
// });

// ========================================
// COMANDOS DE CONSOLA ÚTILES
// ========================================

console.log('💡 Comandos disponibles en consola:');
console.log('  - addCar(carData) : Agregar un nuevo auto');
console.log('  - cars : Ver todos los autos');

console.log('  - filterCars("deportivo") : Filtrar por categoría');
