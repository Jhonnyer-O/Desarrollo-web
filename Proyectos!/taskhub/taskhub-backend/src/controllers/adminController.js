const { createClient } = require('@supabase/supabase-js');
const Profile = require('../models/Profile'); 

// Cliente de Supabase con privilegios de administrador (requiere SUPABASE_SERVICE_ROLE_KEY en tu .env)
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const getAllUsers = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    return res.status(200).json(profiles);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error interno al obtener los usuarios' });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, password, is_active } = req.body;

    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 1. Actualizar la contraseña en Supabase Auth si el admin ingresó una nueva
    if (password && password.trim() !== '') {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        password: password
      });
      if (authError) throw authError;
    }

    // 2. Actualizar los datos del perfil en la tabla 'profiles'
    if (full_name) profile.full_name = full_name;
    if (email) profile.email = email;
    if (role) profile.role = role;
    if (typeof is_active === 'boolean') profile.is_active = is_active;

    await profile.save();

    return res.status(200).json({ message: 'Usuario actualizado con éxito', profile });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ error: 'Error interno al actualizar el usuario' });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar también al usuario de Supabase Auth
    await supabase.auth.admin.deleteUser(id);

    // Eliminar el registro de la tabla profiles
    await profile.destroy();

    return res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error interno al eliminar el usuario' });
  }
};

module.exports = { getAllUsers, updateUserByAdmin, deleteUserByAdmin };