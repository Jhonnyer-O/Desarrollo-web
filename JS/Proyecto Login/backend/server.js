// Importamos las librerías necesarias
const express = require("express");   // Framework para crear el servidor HTTP
const jwt = require("jsonwebtoken");  // Librería para generar y verificar tokens
const bcrypt = require("bcryptjs");   // Para encriptar y comparar contraseñas
const cors = require("cors");         // Para permitir que el frontend pueda conectarse al backend

const app = express(); // Creamos la aplicación de Express
app.use(express.json()); // Middleware para interpretar datos JSON en las peticiones
app.use(cors()); // Middleware que habilita CORS (permite que el frontend acceda al backend)

// Clave secreta con la que firmaremos y verificaremos los tokens
const SECRET_KEY = "mi_clave_secreta";

// Usuario de prueba (en un caso real estaría en una base de datos)
const userDB = {
  username: "admin",
  // Guardamos la contraseña encriptada (nunca en texto plano)
  password: bcrypt.hashSync("123456", 10)
};

// 📌 Ruta para LOGIN
app.post("/login", (req, res) => {
  // Recibimos usuario y contraseña desde el frontend
  const { username, password } = req.body;

  // Verificamos si el usuario existe
  if (username !== userDB.username) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  // Verificamos si la contraseña ingresada coincide con la encriptada
  const isPasswordValid = bcrypt.compareSync(password, userDB.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  // Si todo está bien, generamos un token JWT con duración de 1 hora
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  // Enviamos el token al frontend
  res.json({ message: "Login exitoso", token });
});

// 📌 Ruta protegida (solo se accede con token válido)
app.get("/perfil", (req, res) => {
  // Obtenemos el header "Authorization" → viene en formato "Bearer TOKEN"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extraemos el token

  // Si no hay token, rechazamos la petición
  if (!token) return res.status(403).json({ error: "Token requerido" });

  try {
    // Verificamos que el token sea válido
    const decoded = jwt.verify(token, SECRET_KEY);
    // Enviamos respuesta con los datos del usuario
    res.json({ message: "Acceso permitido", user: decoded });
  } catch (err) {
    // Si el token está mal o expiró
    res.status(401).json({ error: "Token inválido o expirado" });
  }
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("✅ Servidor corriendo en http://localhost:3000");
});
