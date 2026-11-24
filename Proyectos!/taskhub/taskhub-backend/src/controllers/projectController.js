const Project = require('../models/Project');

// Obtener los proyectos del usuario autenticado
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenido del authMiddleware de Supabase
    const projects = await Project.findAll({ where: { userId } });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
};

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const newProject = await Project.create({
      title,
      description,
      userId,
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};