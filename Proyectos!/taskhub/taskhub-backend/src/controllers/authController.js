const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const user = await User.create({ fullName, email, password });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Credenciales incorrectas.' });
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};