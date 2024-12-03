document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const workersTable = document.getElementById('workersTable');
    const addWorkerModal = new bootstrap.Modal(document.getElementById('addWorkerModal'));
    const editWorkerModal = new bootstrap.Modal(document.getElementById('editWorkerModal'));
    let currentWorkerId = null;
    listarTrabajador();

    // Función para listar trabajadores desde la API
    function listarTrabajador() {
        // Recuperar el token desde el localStorage
        const token = localStorage.getItem('token');
        console.log(token);

        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return; // Si no hay token, no realizamos la solicitud
        }

        // Mostrar el overlay de carga
        loadingOverlay.classList.remove('hidden');

        // Realizar la solicitud GET a la API, incluyendo el token en el encabezado
        fetch('http://192.168.1.8/auditoria/works/?page=1&limit=10', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el token en el encabezado
                'Content-Type': 'application/json'  // Especificamos que el contenido de la respuesta es JSON
            }
        })
            .then(response => response.json())
            .then(data => {
                loadWorkers(data.workers); // Usar data.workers que contiene los trabajadores
                console.log(data);

                loadingOverlay.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error al cargar los trabajadores:', error);
                loadingOverlay.classList.add('hidden');
            });
    }

    // Cargar los trabajadores en la tabla
    function loadWorkers(workers) {
        workersTable.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

        // Verificar si los datos son válidos y si existen trabajadores
        if (workers && workers.length > 0) {
            workers.forEach(worker => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${worker.first_name}</td>
                    <td>${worker.last_name}</td>
                    <td>${worker.position}</td>
                    <td>${worker.salary}</td>
                    <td>${worker.hire_date}</td>
                    <td>${worker.status}</td>
                    <td>${worker.created_at}</td>
                    <td>${worker.updated_at}</td>
                    <td>
                        <!-- Editar -->
                        <button class="btn btn-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editWorkerModal" data-id="${worker.id}">Editar</button>
                        <!-- Eliminar -->
                        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteWorkerModal" data-id="${worker.id}">Eliminar</button>
                    </td>
                `;
                workersTable.appendChild(row);
            });
        } else {
            // Si no hay trabajadores, mostrar un mensaje
            workersTable.innerHTML = '<tr><td colspan="9" class="text-center">No workers available.</td></tr>';
        }
    }



    // Evento para actualizar la lista
    document.getElementById('refreshButton').addEventListener('click', () => {
        listarTrabajador(); // Llamar a la función para actualizar los trabajadores
    });

    // Ver perfil de usuario
    document.getElementById('userButton').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('userModal')); // Inicializa el modal
        modal.show();
    });

    // Agregar Trabajador
    document.getElementById('addWorker').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('addWorkerModal')); // Inicializa el modal
        modal.show();
    });

    // boton para editar trabajador(abrir modal):
    workersTable.addEventListener('click', (event) => {
        if (event.target && event.target.matches('.btn-warning')) {
            const workerId = event.target.getAttribute('data-id');
            cargarDatosTrabajador(workerId);
        }
    });


    // boton para eliminar trabajador(abrir modal):
    workersTable.addEventListener('click', (event) => {
        if (event.target && event.target.matches('.btn-danger')) {
            const workerId = event.target.getAttribute('data-id');
            cargarDatosTrabajadorDel(workerId);
        }
    });

    // Eliminar Trabajador (btn)
    document.getElementById('btnDeleteWorker').addEventListener('click', () => {
        trabajadorDel();
    });


    // enviar datos
    document.getElementById('addWorkerButton').addEventListener('click', () => {
        // Recuperar el token desde el localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return; // Si no hay token, no realizamos la solicitud
        }
        // Capturamos los datos del formulario
        const nombre = document.getElementById('addNombre').value;
        const apellido = document.getElementById('addApellido').value;
        const cargo = document.getElementById('addCargo').value;
        const sueldo = document.getElementById('addSueldo').value;
        const fechaContratacion = document.getElementById('addFechaContratacion').value;

        // Crear el objeto con los datos que se enviarán al servidor
        const trabajador = {
            first_name: nombre,
            last_name: apellido,
            position: cargo,
            salary: sueldo,
            hire_date: fechaContratacion,
            // status: "active"
        };


        // Enviar los datos al servidor
        fetch('http://192.168.1.8/auditoria/works/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el token en el encabezado
                'Content-Type': 'application/json'  // Especificamos que el contenido de la solicitud es JSON
            },
            body: JSON.stringify(trabajador)
        })
            .then(response => response.json())
            .then(data => {
                const toast = document.getElementById('liveToast');
                const toastTitle = document.getElementById('toastTitle');
                const toastMessage = document.getElementById('toastMessage');
                if (data.message === "Trabajador creado exitosamente") {
                    // Mostrar mensaje de éxito
                    toastTitle.textContent = "Éxito";
                    toast.classList.remove('bg-danger');
                    toast.classList.add('bg-success');
                    toastMessage.textContent = "El trabajador se ha creado exitosamente.";
                } else {
                    // Mostrar mensaje de error
                    toastTitle.textContent = "Error";
                    toast.classList.remove('bg-success');
                    toast.classList.add('bg-danger');
                    toastMessage.textContent = data.message;
                }
                const toastInstance = new bootstrap.Toast(toast);
                toastInstance.show();
                listarTrabajador();

                document.body.focus();
                addWorkerModal.hide();
            })
            .catch(error => {
                console.error('Error al crear el trabajador:', error);
                const toast = document.getElementById('liveToast');
                const toastTitle = document.getElementById('toastTitle');
                const toastMessage = document.getElementById('toastMessage');
                toastTitle.textContent = "Error";
                toast.classList.remove('bg-success');
                toast.classList.add('bg-danger');
                toastMessage.textContent = "Ocurrió un error al procesar la solicitud.";

                const toastInstance = new bootstrap.Toast(toast);
                toastInstance.show();

                // Cerrar el modal después de la respuesta exitosa
                document.body.focus();
                addWorkerModal.hide();
            });

    });
    // Cerrar el modal manualmente con la "X"
    const closeModalButton = document.querySelector('.btn-close');
    if (closeModalButton) {
        document.body.focus();
        closeModalButton.addEventListener('click', () => {
            addWorkerModal.hide();
        });
    }


    // Función para cargar los datos del trabajador en el modal
    function cargarDatosTrabajador(workerId) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return;
        }

        fetch(`http://192.168.1.8/auditoria/works/?id=${workerId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                currentWorkerId = data.id;
                document.getElementById('editNombre').value = data.first_name;
                document.getElementById('editApellido').value = data.last_name;
                document.getElementById('editCargo').value = data.position;
                document.getElementById('editSueldo').value = data.salary;
                document.getElementById('editFechaContratacion').value = data.hire_date;

                // Rellenar el campo de estado (solo visualización)
                document.getElementById('editEstado').textContent = data.status;

            })
            .catch(error => {
                console.error('Error al cargar los datos del trabajador:', error);
            });
    }


    // Actualizar API
    const form = document.getElementById('editWorkerForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return;
        }

        // Recoger los valores de los campos del formulario
        const updatedData = {
            id: currentWorkerId, // Usamos el ID del trabajador actual
            first_name: document.getElementById('editNombre').value,
            last_name: document.getElementById('editApellido').value,
            position: document.getElementById('editCargo').value,
            salary: parseFloat(document.getElementById('editSueldo').value),
            hire_date: document.getElementById('editFechaContratacion').value,
            status: "active"
        };

        // Enviar los datos a la API mediante PUT
        fetch('http://192.168.1.8/auditoria/works/', {
            method: 'PUT',
            // mode: "no-cors",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Aquí puedes actualizar la UI o cerrar el modal
                editWorkerModal.hide(); // Cerrar el modal
                listarTrabajador();
            })
            .catch(error => {
                console.error('Error al actualizar los datos del trabajador:', error);
            });
    });

    // Obtener user
    function cargarDatosTrabajadorDel(workerId) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return;
        }

        fetch(`http://192.168.1.8/auditoria/works/?id=${workerId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                currentWorkerId = data.id;
                console.log(data.id);
                document.getElementById('nameWorker').innerText = data.first_name + " " + data.last_name;
            })
            .catch(error => {
                console.error('Error al cargar los datos del trabajador:', error);
            });
    }

    // Eliminar API
    function trabajadorDel() {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado. El usuario no está autenticado.');
            return;
        }

        // Recoger los valores de los campos del formulario
        const updatedData = {
            id: currentWorkerId,
        };
        console.log(updatedData.id);


        // Sliminar datos
        fetch('http://192.168.1.8/auditoria/works/', {
            method: 'DELETE',
            // mode: "no-cors",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Aquí puedes actualizar la UI o cerrar el modal
                editWorkerModal.hide(); // Cerrar el modal
                listarTrabajador();
            })
            .catch(error => {
                console.error('Error al actualizar los datos del trabajador:', error);
            });
    };



});