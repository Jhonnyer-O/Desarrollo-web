# 🚀 TaskHub - Sistema Integrado de Gestión de Tareas

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-15.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JWT-Secure-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 📌 Descripción del Proyecto

**TaskHub** es una plataforma web Full Stack diseñada para optimizar la organización personal y profesional mediante la gestión eficiente de tareas, seguimiento de prioridades, métricas en tiempo real y visualización en un calendario interactivo.

Este proyecto fue desarrollado como **Proyecto Integrador / MVP**, aplicando arquitectura desacoplada (Frontend / Backend), autenticación basada en tokens de seguridad y persistencia relacional.

---

## ✨ Características Principales (Historias de Usuario)

- 🔐 **Autenticación Segura:** Registro e inicio de sesión con contraseñas encriptadas (`bcrypt`) y manejo de sesiones persistentes con `JWT` y `AuthContext`.
- 📊 **Dashboard Interactivo:** Panel de control con métricas agregadas (*Total, Pendientes, En Progreso, Completadas*) optimizadas mediante React `useMemo`.
- 📝 **Gestión Completa (CRUD):** Creación, edición, eliminación y cambio dinámico de estado/prioridad para tareas.
- 📅 **Vista de Calendario Mensual:** Componente interactivo que distribuye cronológicamente las tareas según su fecha de vencimiento (`dueDate`).
- 🔍 **Modal de Inspección Diaria:** Visualización rápida de entregables por día en una ventana flotante con efecto *backdrop-blur*.
- 🛡️ **Manejo Resiliente de Errores:** Captura de sesiones expiradas (cód. 401/403) mediante **Interceptores de Axios** y notificaciones dinámicas con **SweetAlert2**.

---

## 🛠️ Pila Tecnológica (Tech Stack)

### **Frontend**
- **Core:** React 18 + Vite
- **Estilos:** Tailwind CSS
- **Iconografía:** Lucide React
- **Peticiones HTTP:** Axios (con Request/Response Interceptors)
- **Notificaciones UI:** SweetAlert2

### **Backend**
- **Entorno:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **ORM:** Sequelize
- **Seguridad:** JSON Web Token (JWT), Bcrypt, CORS, Dotenv

---

## 📂 Estructura del Repositorio

```text
taskhub/
├── 📁 taskhub-backend/
├    ├── 📁 src/                           # Código fuente principal del servidor
│    │     ├── 📁 config/                    # Configuración de base de datos y Sequelize
│    │     ├── 📁 controllers/               # Controladores de lógica de negocio (authController, taskController)
│    │     ├── 📁 middlewares/               # Middlewares de validación y autenticación JWT
│    │     ├── 📁 models/                    # Modelos de datos de Sequelize (User, Task, Category)
│    │     ├── 📁 routes/                    # Definición de rutas de la API REST
│    │     └── 📄 app.js
│    ├── 📄 .env.example                   # ⚠️ Plantilla de variables de entorno (Renombrado desde .env)
│    ├── 📄 .gitignore                     # Archivo para excluir node_modules/ y .env
│    ├── 📄 package.json                   # Gestión de dependencias y scripts de ejecución
│    ├── 📄 package-lock.json              # Registro de versiones exactas de dependencias
│    └── 📄 README.md
│
└── 📁 taskhub-frontend/         # Cliente Web Single Page Application (SPA) en React
    ├── 📁 src/
    │   ├── 📁 api/             # Instancia de Axios con Interceptores
    │   ├── 📁 components/      # Componentes UI (Navbar, TaskCard, TaskModal, CalendarView)
    │   ├── 📁 context/         # Estado Global (AuthContext)
    │   ├── 📁 pages/           # Vistas (Login, Register, Dashboard)
    │   ├── 📄 App.jsx          # Enrutamiento protegido
    │   └── 📄 main.jsx
    ├── 📄 index.html
    ├── 📄 tailwind.config.js
    └── 📄 package.json
```

## 🌐 Endpoints Principales de la API REST

Los endpoints expuestos por la API RESTful de **TaskHub** se encuentran estructurados y protegidos mediante autenticación JWT:

### 🔐 Autenticación y Usuarios (`/api/auth`)

| Método | Endpoint | Descripción | Cuerpo de la Petición (Body) | Protección JWT |
| :---: | :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Registro de un nuevo usuario en la plataforma. | `{ "name", "email", "password" }` | ❌ No |
| `POST` | `/api/auth/login` | Autenticación y generación del token JWT. | `{ "email", "password" }` | ❌ No |

### 📝 Gestión de Tareas (`/api/tasks`)

| Método | Endpoint | Descripción | Parámetros / Body | Protección JWT |
| :---: | :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Obtener todas las tareas del usuario autenticado. | Parámetros Query opcionales: `status`, `priority` | 🔒 Sí |
| `POST` | `/api/tasks` | Registrar una nueva tarea. | `{ "title", "description", "status", "priority", "dueDate" }` | 🔒 Sí |
| `PUT` | `/api/tasks/:id` | Actualizar todos los campos de una tarea existente. | `{ "title", "description", "status", "priority", "dueDate" }` | 🔒 Sí |
| `PATCH` | `/api/tasks/:id/status` | Actualizar únicamente el estado de una tarea. | `{ "status" }` | 🔒 Sí |
| `DELETE` | `/api/tasks/:id` | Eliminar de forma permanente una tarea por su ID. | Parámetro de ruta: `id` | 🔒 Sí |

## 🛠️ Instalación de librerías y Dependencias
### ⚙️ 1. Backend (taskhub-backend)

Comando de instalación en un solo paso:
```bash
npm install express cors dotenv sequelize pg pg-hstore jsonwebtoken bcryptjs nodemailer node-cron
npm install -D nodemon
```

Desglose de comandos individuales y propósito:

| Librería | Comando de Instalación Individual | Propósito en el Proyecto |
| :---: | :--- | :--- |
|Express|npm install express|Framework principal para la creación de la API REST y rutas.|
|CORS|npm install cors|Permite la comunicación entre el frontend y backend.|
|Dotenv|npm install dotenv|Carga variables de entorno desde el archivo .env.|
|Sequelize|npm install sequelize|ORM para interactuar con la base de datos PostgreSQL.|
|PostgreSQL Driver|npm install pg pg-hstore|Cliente y utilidades para la conexión a PostgreSQL.|
|JWT|npm install jsonwebtoken|Generación y verificación de tokens de autenticación.|
|Bcryptjs|npm install bcryptjs|Encriptación y hasheo de contraseñas de usuarios.|
|Nodemailer|npm install nodemailer|Servicio para el envío de correos desde el backend.|
|Node-Cron|npm install node-cron|Programación de tareas automáticas en segundo plano.|
|Nodemon (Dev)|npm install -D nodemon|Reinicio automático del servidor durante el desarrollo.|

### 💻 2. Frontend (taskhub-frontend)

Comando de instalación en un solo paso:
```bash
npm install axios lucide-react sweetalert2
npm install -D tailwindcss postcss autoprefixer
```

Desglose de comandos individuales y propósito:
| Librería | Comando de Instalación Individual | Propósito en el Proyecto |
| :---: | :--- | :--- |
| Axios | npm install axios | Cliente HTTP con interceptores para peticiones al backend. |
| Lucide React | npm install lucide-react | Iconografía vectorial para botones, estados y el calendario. |
| SweetAlert2 | npm install sweetalert2 | Modales y alertas emergentes interactivas de usuario. |
| Tailwind CSS (Dev) | npm install -D tailwindcss postcss autoprefixer | Framework de estilos CSS utility-first y procesamiento. |
