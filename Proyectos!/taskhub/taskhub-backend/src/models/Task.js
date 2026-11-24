const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date',
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Media',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pendiente',
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'project_id',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'created_by',
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'assigned_to',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'tasks',
  schema: 'public',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Task;