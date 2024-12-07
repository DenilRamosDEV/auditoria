$('#addWorkerButton').on('click', function (event) {
    // Evitar que se envíe el formulario al hacer clic en el botón
    event.preventDefault();

    // Capturar los datos del formulario
    var trabajador = {
        first_name: $('#addNombre').val(),
        last_name: $('#addApellido').val(),
        position: $('#addCargo').val(),
        salary: $('#addSueldo').val(),
        hire_date: $('#addFechaContratacion').val()
    };

    // Obtener el token de autenticación
    var token = localStorage.getItem('token');  // Asegúrate de tener el token disponible

    // Enviar los datos a la API utilizando AJAX
    $.ajax({
        url: 'http://192.168.18.67/auditoria/works/',  // URL de la API
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el token en el encabezado
            'Content-Type': 'application/json'  // Especificamos que el contenido de la solicitud es JSON
        },
        data: JSON.stringify(trabajador),  // Convertimos los datos a formato JSON
        success: function (response) {
            console.log('Trabajador agregado correctamente:', response);
            // Aquí puedes cerrar el modal o hacer otras acciones después de la respuesta exitosa
            $('#addWorkerModal').modal('hide');
            // Opcional: Llamar a la función para actualizar la lista de trabajadores
            showToast('Trabajador creado exitosamente.', 'success');
        },
        error: function (xhr, status, error) {
            console.error('Error al agregar trabajador:', error);
            // Maneja el error de manera adecuada (mostrar un mensaje de error, etc.)
            showToast('Hubo un error al crear trabajador.', 'error');
        }
    });
});