const { Op } = require('sequelize');
const { Task, Category, User, TaskAssignee, Notification } = require('../models');

// Helper para verificar si el usuario es ADMIN en base de datos
const isUserAdmin = async (userId) => {
  const profile = await User.findByPk(userId, { attributes: ['id', 'role'] });
  return profile && profile.role === 'ADMIN';
};

// Helper interno para crear solicitudes de colaboración sin duplicar pendientes
const createAssigneeRequests = async ({
  taskId,
  requesterId,
  candidateIds,
  existingAssigneeIds,
  note,
}) => {
  const uniqueIds = [...new Set(candidateIds)].filter(
    (uid) => uid && uid !== requesterId && !existingAssigneeIds.includes(uid),
  );

  for (const recipientId of uniqueIds) {
    const existingPending = await Notification.findOne({
      where: {
        taskId,
        recipientId,
        type: 'ASSIGNEE_REQUEST',
        status: 'pending',
      },
    });

    if (!existingPending) {
      await Notification.create({
        recipientId,
        requesterId,
        taskId,
        type: 'ASSIGNEE_REQUEST',
        status: 'pending',
        note: note?.trim() || null,
      });
    }
  }
};

// Obtener usuarios activos para asignar como colaboradores
exports.getAvailableUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_active: true },
      attributes: ['id', 'full_name', 'email', 'role'],
      order: [['full_name', 'ASC']],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios disponibles:', error);
    res
      .status(500)
      .json({ message: 'Error al obtener usuarios disponibles', error: error.message });
  }
};

// Obtiene las tareas creadas por el usuario o donde está asignado como colaborador
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscamos IDs de tareas donde el usuario está asignado
    const assignedRows = await TaskAssignee.findAll({
      where: { userId },
      attributes: ['taskId'],
    });
    const assignedTaskIds = assignedRows.map((row) => row.taskId);

    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { createdBy: userId },
          { id: { [Op.in]: assignedTaskIds } },
        ],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
          required: false,
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'full_name', 'email'],
          through: { attributes: [] },
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
};

// Crear una nueva tarea (con colaboradores opcionales vía solicitud de aprobación)
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      categoryId,
      projectId,
      assigneeIds,
      requestNote,
    } = req.body;
    const currentUserId = req.user.id;

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      projectId: projectId || null,
      createdBy: currentUserId,
    });

    let pendingRequestsCount = 0;

    if (Array.isArray(assigneeIds) && assigneeIds.length > 0) {
      const uniqueIds = [...new Set(assigneeIds)];

      // Si el creador se incluyó a sí mismo, queda asignado de inmediato
      if (uniqueIds.includes(currentUserId)) {
        await newTask.setAssignees([currentUserId]);
      }

      // Los demás usuarios reciben una solicitud pendiente de aprobación
      const invitedIds = uniqueIds.filter((uid) => uid !== currentUserId);
      if (invitedIds.length > 0) {
        await createAssigneeRequests({
          taskId: newTask.id,
          requesterId: currentUserId,
          candidateIds: invitedIds,
          existingAssigneeIds: [currentUserId],
          note: requestNote,
        });
        pendingRequestsCount = invitedIds.length;
      }
    }

    const fullTask = await Task.findByPk(newTask.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
          required: false,
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'full_name', 'email'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    res.status(201).json({
      message:
        pendingRequestsCount > 0
          ? 'Tarea creada. Se envió solicitud de aprobación a los colaboradores invitados.'
          : 'Tarea creada exitosamente',
      task: fullTask,
      pendingRequestsCount,
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

// Actualizar una tarea (creador o colaborador asignado)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      categoryId,
      projectId,
      assigneeIds,
      requestNote,
    } = req.body;
    const currentUserId = req.user.id;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignees',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const isCreator = task.createdBy === currentUserId;
    const isAssignee = (task.assignees || []).some((u) => u.id === currentUserId);
    const admin = await isUserAdmin(currentUserId);

    if (!isCreator && !isAssignee && !admin) {
      return res
        .status(403)
        .json({ message: 'Sin autorización para modificar esta tarea.' });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate;
    if (priority !== undefined) dataToUpdate.priority = priority;
    if (status !== undefined) dataToUpdate.status = status;
    if (projectId !== undefined) dataToUpdate.projectId = projectId || null;

    await task.update(dataToUpdate);

    let pendingRequestsCount = 0;

    // Solo creador o ADMIN puede modificar la lista de colaboradores
    if (Array.isArray(assigneeIds)) {
      if (!isCreator && !admin) {
        return res.status(403).json({
          message:
            'Solo el creador o un administrador puede cambiar los colaboradores.',
        });
      }

      const currentAssigneeIds = (task.assignees || []).map((u) => u.id);
      const uniqueTargetIds = [...new Set(assigneeIds)];

      // Mantenemos solo a quienes ya estaban aprobados y siguen seleccionados
      const keptAssigneeIds = currentAssigneeIds.filter((uid) =>
        uniqueTargetIds.includes(uid),
      );
      await task.setAssignees(keptAssigneeIds);

      // Quienes no estaban asignados reciben solicitud de aprobación
      const newlyInvitedIds = uniqueTargetIds.filter(
        (uid) => !currentAssigneeIds.includes(uid),
      );

      if (newlyInvitedIds.length > 0) {
        const selfIds = newlyInvitedIds.filter((uid) => uid === currentUserId);
        if (selfIds.length > 0) {
          await task.setAssignees([...keptAssigneeIds, ...selfIds]);
        }

        const otherIds = newlyInvitedIds.filter((uid) => uid !== currentUserId);
        if (otherIds.length > 0) {
          await createAssigneeRequests({
            taskId: task.id,
            requesterId: currentUserId,
            candidateIds: otherIds,
            existingAssigneeIds: [...keptAssigneeIds, ...selfIds],
            note: requestNote,
          });
          pendingRequestsCount = otherIds.length;
        }
      }
    }

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
          required: false,
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'full_name', 'email'],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    res.status(200).json({
      message:
        pendingRequestsCount > 0
          ? 'Tarea actualizada. Se enviaron solicitudes de aprobación a los nuevos colaboradores.'
          : 'Tarea actualizada exitosamente',
      task: updatedTask,
      pendingRequestsCount,
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar una tarea (solo creador o ADMIN)
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    const isCreator = task.createdBy === currentUserId;
    const admin = await isUserAdmin(currentUserId);

    if (!isCreator && !admin) {
      return res.status(403).json({
        message:
          'Solo el creador o un administrador puede eliminar esta tarea directamente.',
      });
    }

    await task.destroy();
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res
      .status(500)
      .json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};