const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

// Lista de usuarios activos disponibles para asignar como colaboradores
router.get('/users', taskController.getAvailableUsers);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;