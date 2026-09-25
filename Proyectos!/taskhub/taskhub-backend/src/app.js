const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Endpoint de prueba 
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor TaskHub activo y respondiendo' });
});

const PORT = process.env.PORT || 5000;

// Sincronización con PostgreSQL e inicio del servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos PostgreSQL conectada y sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
  });