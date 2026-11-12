const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Validamos el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Error validando token con Supabase:', error?.message);
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    // Asignamos el ID de usuario de Supabase para los controladores
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error('Error en middleware:', error);
    return res.status(500).json({ message: 'Error interno de autenticación.', error: error.message });
  }
};

module.exports = verifyToken;