const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Profile');
const Task = require('./Task');
const Category = require('./Category');
const Project = require('./Project');

// Modelo de unión para tareas colaborativas
const TaskAssignee = sequelize.define('TaskAssignee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'task_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
}, {
  tableName: 'task_assignees',
  schema: 'public',
  timestamps: true,
  underscored: true,
});

// Modelo de notificaciones para solicitudes de colaboración y eliminación
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'recipient_id',
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'requester_id',
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'task_id',
  },
  type: {
    type: DataTypes.ENUM('ASSIGNEE_REQUEST', 'DELETE_REQUEST'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'notifications',
  schema: 'public',
  timestamps: true,
  underscored: true,
});

// Relación 1:N -> Creador de la tarea
User.hasMany(Task, { foreignKey: 'createdBy', onDelete: 'CASCADE', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Relaciones de notificaciones
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
Notification.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
Notification.belongsTo(Task, { as: 'task', foreignKey: 'taskId', onDelete: 'SET NULL' });

User.hasMany(Notification, {
  as: 'receivedNotifications',
  foreignKey: 'recipientId',
});
User.hasMany(Notification, {
  as: 'sentNotifications',
  foreignKey: 'requesterId',
});

// Relación N:M -> Tareas colaborativas (usuarios asignados)
Task.belongsToMany(User, {
  through: TaskAssignee,
  foreignKey: 'taskId',
  otherKey: 'userId',
  as: 'assignees',
});

User.belongsToMany(Task, {
  through: TaskAssignee,
  foreignKey: 'userId',
  otherKey: 'taskId',
  as: 'assignedTasks',
});

// Relación 1:N -> Un Usuario tiene muchas Categorías
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

// Relación 1:N -> Un Usuario tiene muchos Proyectos
User.hasMany(Project, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Relación 1:N -> Un Proyecto tiene muchas Tareas
Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'SET NULL', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

module.exports = {
  sequelize,
  User,
  Task,
  Category,
  Project,
  TaskAssignee,
  Notification,
};