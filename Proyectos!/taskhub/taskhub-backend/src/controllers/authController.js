const User = require('../models/Profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const user = await User.create({ 
      full_name: fullName, 
      email, 
      password 
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, fullName: user.full_name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Autenticar directamente con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({ message: 'Credenciales inválidas o correo no registrado.' });
    }

    // Retornamos el token oficial de Supabase (access_token) y los datos del usuario
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: data.session.access_token, // Este es el token que el frontend guardará y enviará
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
};