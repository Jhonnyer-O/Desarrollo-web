const { User } = require('../models'); // Asegúrate de que la ruta a tus modelos sea correcta

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado. Token faltante o inválido.' });
    }

    // Buscamos al usuario directamente en la base de datos para obtener su rol actualizado
    const user = await User.findByPk(req.user.id);

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    // Si es administrador, lo dejamos pasar
    next();
  } catch (error) {
    console.error('Error en adminMiddleware:', error);
    return res.status(500).json({ message: 'Error interno del servidor al verificar permisos.' });
  }
};

module.exports = adminMiddleware;