const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserByAdmin, deleteUserByAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware'); // Tu middleware existente

router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, updateUserByAdmin);
router.delete('/users/:id', authMiddleware, deleteUserByAdmin); // <-- Añadida la ruta de eliminación

module.exports = router;