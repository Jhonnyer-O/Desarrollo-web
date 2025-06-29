  // 2. Validación Básica del Formulario de Contacto
    const contactForm = document.querySelector('.contact form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            // Obtén los campos
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');

            // Restablece cualquier mensaje de error previo
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            let isValid = true;

            // Validación de Nombre
            if (nombre.value.trim() === '') {
                displayError(nombre, 'El nombre es obligatorio.');
                isValid = false;
            }

            // Validación de Email
            if (email.value.trim() === '') {
                displayError(email, 'El email es obligatorio.');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                displayError(email, 'Por favor, introduce un email válido.');
                isValid = false;
            }

            // Validación de Mensaje
            if (mensaje.value.trim() === '') {
                displayError(mensaje, 'El mensaje no puede estar vacío.');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault(); // Detiene el envío del formulario si hay errores
            } else {
                // Si todo es válido, puedes enviar el formulario.
                // Aquí, para este ejemplo, solo mostraremos una alerta.
                // En un proyecto real, aquí harías una petición AJAX (fetch) para enviar los datos al servidor.
                alert('Formulario enviado con éxito (¡En un proyecto real, se enviaría a un servidor!).');
                event.preventDefault(); // Para evitar que la página se recargue en este demo
                contactForm.reset(); // Limpia el formulario
            }
        });
    }

    // Función auxiliar para mostrar mensajes de error
    function displayError(inputElement, message) {
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '0.9em';
        errorMessage.style.marginTop = '5px';
        errorMessage.textContent = message;
        inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling); // Inserta después del input
        inputElement.style.borderColor = 'red'; // Marca el borde del input en rojo
    }

    // Función auxiliar para validar formato de email (simple)
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }