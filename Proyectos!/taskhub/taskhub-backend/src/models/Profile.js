const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt'); // Asegúrate de importar bcrypt aquí también

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'profiles',
  schema: 'public',
  timestamps: false,
  freezeTableName: true
});

Profile.beforeSave(async (profile) => {
  if (profile.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    profile.password = await bcrypt.hash(profile.password, salt);
  }
});
// 👇 AÑADE O CORRIGE ESTE MÉTODO EN TU MODELO PROFILE
Profile.prototype.validPassword = async function (passwordInput) {
  console.log("Contraseña ingresada:", passwordInput);
  console.log("Hash en base de datos:", this.password);
  
  const match = await bcrypt.compare(passwordInput, this.password);
  console.log("¿Coinciden?", match);
  
  return match;
};
module.exports = Profile;