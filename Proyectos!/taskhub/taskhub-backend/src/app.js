const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/notifications", notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor TaskHub activo y respondiendo' });
});

const PORT = process.env.PORT || 5000;

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