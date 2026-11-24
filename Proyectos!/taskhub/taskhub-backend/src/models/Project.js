const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name' // Mapea 'title' al campo 'name' de Supabase
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'color'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'owner_id' // Mapea 'userId' al campo 'owner_id' de Supabase
  }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Project;