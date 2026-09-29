Deploy:

npm init -y
npm install express pg pg-hstore sequelize dotenv bcryptjs jsonwebtoken cors nodemailer node-cron
npm install -D nodemon

Inicializar el proyecto Frontend con React y Vite en la raíz de tu proyecto (al lado de taskhub-backend):

Bash
npm create vite@latest taskhub-frontend -- --template react
Instalar dependencias necesarias:

Bash
cd taskhub-frontend
npm install axios react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer