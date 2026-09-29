const { Task, Category } = require('../models');

// Obtiene las taread de los usuarios
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [{ model: Category, attributes: ['id', 'name', 'color'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
};

//Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, categoryId } = req.body;

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      categoryId,
      userId: req.user.id, // Viene extraído del Token JWT
    });

    res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

//Actualizar una tarea existente
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, categoryId } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada o sin autorización.' });
    }

    await task.update({ title, description, dueDate, priority, status, categoryId });
    res.status(200).json({ message: 'Tarea actualizada exitosamente', task });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

//Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada o sin autorización.' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};