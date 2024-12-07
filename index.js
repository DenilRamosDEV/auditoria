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
    function apiLogin(event) {
        event.preventDefault();
        loginButton.disabled = true;
        loginButton.textContent = 'Verificando...';

        const userData = {
            username: usernameInput.value.trim(),
            password: passwordInput.value.trim()
        };

        // Realizar la llamada a la API
        fetch('http://192.168.18.67/auditoria/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = './worker/view/worker.html';
                } else {
                    showErrorToast(data.message);
                    loginButton.disabled = false;
                    loginButton.textContent = 'Iniciar sesión';
                }
            })
            .catch(error => {
                showErrorToast('Hubo un problema con la conexión. Intenta nuevamente.');
                loginButton.disabled = false;
                loginButton.textContent = 'Iniciar sesión';
            });
    }

    // Función para mostrar el toast de error
    function showErrorToast(message) {
        const toastBody = errorMessage.querySelector('.toast-body');
        toastBody.textContent = message;
        toast.show();
    }
    form.addEventListener('submit', apiLogin);
})();
