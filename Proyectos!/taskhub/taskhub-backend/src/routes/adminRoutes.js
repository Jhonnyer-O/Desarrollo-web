const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserByAdmin, deleteUserByAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); // <-- Importa el nuevo middleware

// Aplicamos ambos middlewares a todas las rutas de administración
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserByAdmin);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUserByAdmin);

module.exports = router;