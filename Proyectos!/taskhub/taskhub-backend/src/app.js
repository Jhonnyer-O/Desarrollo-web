const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // <-- 1. Importa tus rutas de tareas (ajusta el nombre del archivo si es diferente)
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // <-- 2. Registra el endpoint para las tareas

// Endpoint de prueba 
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor TaskHub activo y respondiendo' });
});

const PORT = process.env.PORT || 5000;

// Sincronización con PostgreSQL e inicio del servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos PostgreSQL conectada y sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
  });