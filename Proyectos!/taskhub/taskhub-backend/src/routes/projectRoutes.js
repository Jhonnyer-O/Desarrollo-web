const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middlewares/authMiddleware'); // Tu middleware actual

router.use(verifyToken); // Protegemos todas las rutas con Supabase Auth

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);

module.exports = router;