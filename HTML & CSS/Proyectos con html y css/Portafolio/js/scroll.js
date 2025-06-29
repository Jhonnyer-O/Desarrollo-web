document.addEventListener('DOMContentLoaded', () => {
    console.log("¡JavaScript cargado y listo!");

    //Smooth Scrolling para enlaces de navegación
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previene el comportamiento de salto predeterminado

            const targetId = this.getAttribute('href'); // Obtiene el ID del destino (ej. "#inicio")
            const targetElement = document.querySelector(targetId); // Selecciona el elemento con ese ID

            if (targetElement) {
                // Calcula la posición para tener en cuenta el encabezado fijo
                const headerOffset = document.querySelector('header').offsetHeight; // Altura del header
                const elementPosition = targetElement.getBoundingClientRect().top; // Posición del elemento relativa al viewport
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Ajusta el offset y un poco más de margen

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Hace el scroll suave
                });

                // Opcional: Cierra el menú de navegación en móviles después de hacer clic
                // Si tienes un menú hamburguesa que se cierra con JS, lo pondrías aquí.
            }
        });
    });

  

    //Cambiar estilo del Header al hacer Scroll
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero'); // La primera sección

    if (header && heroSection) {
        // Observador de intersección para saber cuándo el hero está fuera de la vista
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Si el hero NO está intersectando (estamos haciendo scroll hacia abajo)
                    header.classList.add('scrolled');
                } else {
                    // Si el hero SÍ está intersectando (estamos en la parte superior)
                    header.classList.remove('scrolled');
                }
            });
        }, {
            rootMargin: '0px 0px -100% 0px' // Umbral para cuando el hero sale completamente de la vista
            // rootMargin: '-100px 0px 0px 0px' // Podrías ajustar esto para que cambie antes
        });

        observer.observe(heroSection);
    }
});