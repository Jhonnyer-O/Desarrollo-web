const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');

// Relación 1:N -> Un Usuario tiene muchas Tareas
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Relación 1:N -> Un Usuario tiene muchas Categorías
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

// Relación 1:N -> Una Categoría tiene muchas Tareas
Category.hasMany(Task, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Task.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Task,
  Category,
};