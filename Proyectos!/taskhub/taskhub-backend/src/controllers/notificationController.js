const { Notification, Task, User, sequelize } = require('../models');

// Listar notificaciones pendientes del usuario autenticado
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: {
        recipientId: userId,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status', 'createdBy'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res
      .status(500)
      .json({ message: 'Error al obtener notificaciones', error: error.message });
  }
};

// Crear solicitud de eliminación cuando alguien que no es el creador quiere borrar una tarea
exports.createDeleteRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { taskId } = req.params;
    const { note } = req.body || {};

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    if (task.createdBy === requesterId) {
      return res.status(400).json({
        message: 'Eres el creador de la tarea, puedes eliminarla directamente.',
      });
    }

    const existingPending = await Notification.findOne({
      where: {
        taskId: task.id,
        requesterId,
        recipientId: task.createdBy,
        type: 'DELETE_REQUEST',
        status: 'pending',
      },
    });

    if (existingPending) {
      return res.status(409).json({
        message: 'Ya enviaste una solicitud de eliminación pendiente para esta tarea.',
      });
    }

    const notification = await Notification.create({
      recipientId: task.createdBy,
      requesterId,
      taskId: task.id,
      type: 'DELETE_REQUEST',
      status: 'pending',
      note: note?.trim() || null,
    });

    return res.status(201).json({
      message: 'Solicitud de eliminación enviada al creador de la tarea.',
      notification,
    });
  } catch (error) {
    console.error('Error al crear solicitud de eliminación:', error);
    return res
      .status(500)
      .json({ message: 'Error al crear solicitud de eliminación', error: error.message });
  }
};

// Aprobar o rechazar una notificación
exports.respondNotification = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { action } = req.body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Acción inválida. Usa approve o reject.' });
    }

    if (!id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'ID de notificación requerido.' });
    }

    const notification = await Notification.findByPk(id, { transaction });
    if (!notification) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Notificación no encontrada.' });
    }

    if (notification.recipientId !== userId) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: 'No tienes permiso para responder esta notificación.' });
    }

    if (action === 'dismiss') {
      notification.status = 'read';
      await notification.save({ transaction });
      await transaction.commit();
      return res.status(200).json({
        message: 'Notificación marcada como leída.',
        notification,
      });
    }

    if (notification.requesterId && notification.requesterId !== userId) {
      const responderName =
        req.user.full_name || req.user.email || 'El usuario';
      const isDelete = notification.type === 'DELETE_REQUEST';
      const decisionText = action === 'approve' ? 'aprobó' : 'rechazó';
      const messageText = isDelete
        ? `${responderName} ${decisionText} la solicitud de eliminación de la tarea.`
        : `${responderName} ${decisionText} tu invitación a colaborar en la tarea.`;

      await Notification.create(
        {
          recipientId: notification.requesterId,
          requesterId: userId,
          taskId: notification.taskId,
          type: 'RESPONSE_INFO',
          status: 'pending',
          note: messageText,
        },
        { transaction }
      );
    }

    if (notification.status !== 'pending') {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: 'Esta notificación ya fue respondida.' });
    }

    if (action === 'approve') {
      if (notification.type === 'ASSIGNEE_REQUEST' && notification.taskId) {
        const task = await Task.findByPk(notification.taskId, { transaction });
        if (task) {
          await task.addAssignee(userId, { transaction });
        }
      }

      if (notification.type === 'DELETE_REQUEST' && notification.taskId) {
        const task = await Task.findByPk(notification.taskId, { transaction });
        if (task) {
          await task.destroy({ transaction });
        }
      }

      notification.status = 'approved';
    } else {
      notification.status = 'rejected';
    }

    await notification.save({ transaction });

    if (notification.requesterId && notification.requesterId !== userId) {
      const responderName =
        req.user.full_name || req.user.email || 'El usuario';
      const decisionText = action === 'approve' ? 'aprobó' : 'rechazó';
      const requestLabel =
        notification.type === 'DELETE_REQUEST'
          ? 'la solicitud de eliminación de la tarea'
          : 'tu invitación a colaborar en la tarea';

      await Notification.create(
        {
          recipientId: notification.requesterId,
          requesterId: userId,
          taskId: notification.taskId,
          type: 'RESPONSE_INFO',
          status: 'pending',
          note: `${responderName} ${decisionText} ${requestLabel}.`,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(200).json({
      message:
        action === 'approve'
          ? 'Solicitud aprobada correctamente.'
          : 'Solicitud rechazada.',
      notification,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al responder notificación:', error);
    return res
      .status(500)
      .json({ message: 'Error al responder notificación', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada.' });
    }

    if (notification.recipientId !== userId) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para eliminar esta notificación.' });
    }

    await notification.destroy();
    return res.status(200).json({ message: 'Notificación eliminada.' });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return res
      .status(500)
      .json({ message: 'Error al eliminar notificación', error: error.message });
  }
};

// --- DESPUÉS de `exports.deleteNotification` ---
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedCount = await Notification.destroy({
      where: {
        recipientId: userId,
      },
    });

    return res.status(200).json({
      message: 'Todas las notificaciones fueron eliminadas.',
      deletedCount,
    });
  } catch (error) {
    console.error('Error al eliminar todas las notificaciones:', error);
    return res
      .status(500)
      .json({
        message: 'Error al eliminar todas las notificaciones',
        error: error.message,
      });
  }
};