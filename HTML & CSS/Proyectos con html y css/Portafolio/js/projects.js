document.addEventListener('DOMContentLoaded', () => {
    console.log("¡JavaScript cargado y listo!");

    // ... (Tu código existente para Smooth Scrolling y Validación de Formulario) ...

    // --- 4. Sección de Proyectos Dinámicos ---
    const projects = [
        {
            title: "Proyecto Clon de Landing Page",
            description: "Un sitio web estático simple, enfocado en HTML semántico y estilos CSS responsivos.",
            image: "https://via.placeholder.com/400x200?text=Proyecto+1", // URL de la imagen del proyecto
            demoLink: "#", // Enlace a la demo del proyecto (puedes cambiarlo a una URL real)
            repoLink: "#"  // Enlace al repositorio de GitHub (puedes cambiarlo a una URL real)
        },
        {
            title: "Calculadora Interactiva",
            description: "Una calculadora web funcional construida con HTML, CSS y lógica básica de JavaScript.",
            image: "https://via.placeholder.com/400x200?text=Proyecto+2",
            demoLink: "#",
            repoLink: "#"
        },
        {
            title: "Juego Simple de Adivinanza",
            description: "Un pequeño juego donde el usuario adivina un número, implementado con JavaScript.",
            image: "https://via.placeholder.com/400x200?text=Proyecto+3",
            demoLink: "#",
            repoLink: "#"
        },
        {
            title: "Sitio Web de Recetas",
            description: "Un sitio con varias recetas y filtros, demostrando organización de contenido.",
            image: "https://via.placeholder.com/400x200?text=Proyecto+4",
            demoLink: "#",
            repoLink: "#"
        }
        // Puedes añadir más proyectos aquí siguiendo el mismo formato
    ];

    const projectsContainer = document.getElementById('projects-container');

    if (projectsContainer) {
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');

            projectCard.innerHTML = `
                <img src="${project.image}" alt="Imagen del proyecto ${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-links">
                        <a href="${project.demoLink}" target="_blank" class="btn-project">Ver Demo</a>
                        <a href="${project.repoLink}" target="_blank" class="btn-project btn-secondary">Código Fuente</a>
                    </div>
                </div>
            `;
            // target="_blank" hace que el enlace se abra en una nueva pestaña

            projectsContainer.appendChild(projectCard);
        });
    }

}); // Fin de DOMContentLoaded