// Variable para almacenar la página actual
let currentPage = 1;
const limit = 10; // Definir el límite de resultados por página

const token = localStorage.getItem('token');
const loadingOverlay = document.getElementById('loading-overlay'); // Asumimos que tienes un overlay de carga

// Función para cargar los trabajadores
function loadWorkers(workers) {
    const tbody = document.getElementById('empleados-tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    workers.forEach(worker => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${worker.id}</td>
            <td>${worker.nombre}</td>
            <td>${worker.apellido}</td>
            <td>${worker.cargo}</td>
            <td>${worker.sueldo}</td>
            <td>${worker.fecha_contratacion}</td>
            <td>${worker.estado}</td>
            <td>${worker.fecha_creacion}</td>
            <td>${worker.fecha_actualizacion}</td>
            <td>
                <button class="btn btn-primary btn-sm">Editar</button>
                <button class="btn btn-danger btn-sm">Archivar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para actualizar la paginación
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpiar la paginación antes de agregar nuevos botones

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');

        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = i;
            fetchData();
        });

        li.appendChild(a);
        pagination.appendChild(li);
    }
}

// Función para obtener los datos de la API
function fetchData() {
    if (!token) {
        console.error('Token no encontrado. El usuario no está autenticado.');
        return; // Si no hay token, no realizamos la solicitud
    }

    // Mostrar el overlay de carga
    loadingOverlay.classList.remove('hidden');

    // Realizar la solicitud GET a la API, incluyendo el token en el encabezado
    fetch(`http://192.168.18.67/auditoria/works/?page=1&limit=10`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el token en el encabezado
            'Content-Type': 'application/json'  // Especificamos que el contenido de la respuesta es JSON
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            loadWorkers(data.workers); // Usar data.workers que contiene los trabajadores
            updatePagination(data.totalPages); // Usar data.totalPages que contiene el total de páginas
            loadingOverlay.classList.add('hidden');
        })
        .catch(error => {
            console.error('Error al cargar los trabajadores:', error);
            loadingOverlay.classList.add('hidden');
        });
}

// Llamar a fetchData para obtener los datos cuando la página se carga
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});