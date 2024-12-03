(function () {
    'use strict';

    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');  // Cambié "email" a "username"
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(errorMessage);

    // Función para habilitar/deshabilitar el botón
    function toggleButtonState() {
        const isUsernameValid = usernameInput.validity.valid && usernameInput.value.trim() !== ''; // Validación del nombre de usuario
        const isPasswordValid = passwordInput.value.length >= 6;  // Validación de contraseña mínima de 7 caracteres
        loginButton.disabled = !(isUsernameValid && isPasswordValid);
    }

    // Validación en tiempo real
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim() === '') {
            usernameInput.classList.add('is-invalid');
            usernameInput.classList.remove('is-valid');
        } else {
            usernameInput.classList.add('is-valid');
            usernameInput.classList.remove('is-invalid');
        }
        toggleButtonState();
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length < 6) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
        } else {
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
        }
        toggleButtonState();
    });

    // Función para hacer la llamada a la API y manejar la respuesta
    // Función para hacer la llamada a la API y manejar la respuesta
    function apiLogin(event) {
        event.preventDefault(); // Evita el envío real del formulario
        loginButton.disabled = true; // Desactiva el botón temporalmente
        loginButton.textContent = 'Verificando...';

        const userData = {
            username: usernameInput.value.trim(), // Enviar el nombre de usuario
            password: passwordInput.value.trim()   // Enviar la contraseña
        };

        // Realizar la llamada a la API
        fetch('http://192.168.1.8/auditoria/auth/', {
            method: 'POST', // Usamos POST para enviar datos
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                console.log(data);

                if (data.status === 'success') {
                    // Si la API devuelve que el login fue exitoso
                    // Almacenar el token y los datos del usuario en localStorage
                    localStorage.setItem('token', data.token); // Guardar el token
                    localStorage.setItem('user', JSON.stringify(data.user)); // Guardar los datos del usuario (como un objeto JSON)

                    // Redirigir al usuario a la página de recursos humanos
                    window.location.href = 'prueba.html';
                } else {
                    // Si la API devuelve un error, mostrar mensaje de error
                    showErrorToast(data.message);
                    loginButton.disabled = false; // Reactivar el botón
                    loginButton.textContent = 'Iniciar sesión';
                }
            })
            .catch(error => {
                // Manejo de errores de red o problemas con la API
                showErrorToast('Hubo un problema con la conexión. Intenta nuevamente.');
                loginButton.disabled = false; // Reactivar el botón
                loginButton.textContent = 'Iniciar sesión';
                console.error('Error de red o con la API:', error);
            });
    }


    // Función para mostrar el toast de error
    function showErrorToast(message) {
        const toastBody = errorMessage.querySelector('.toast-body');
        toastBody.textContent = message; // Establece el mensaje de error
        toast.show(); // Muestra el toast
    }

    // Validación y simulación en el evento submit
    form.addEventListener('submit', apiLogin);
})();
