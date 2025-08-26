// URL del backend al que se harán las peticiones
const API_URL = "http://localhost:3000";

// 📌 Función para hacer LOGIN
async function login() {
  // Obtenemos los valores de los inputs
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Hacemos una petición POST al backend con usuario y contraseña
    const res = await fetch(`${API_URL}/login`, {
      method: "POST", // Tipo de petición
      headers: { "Content-Type": "application/json" }, // Indicamos que enviamos JSON
      body: JSON.stringify({ username, password }) // Enviamos datos al servidor
    });

    // Convertimos la respuesta en JSON
    const data = await res.json();

    if (res.ok) {
      // Guardamos el token en localStorage (para usarlo después)
      localStorage.setItem("token", data.token);

      // Mostramos mensaje en pantalla
      document.getElementById("response").innerHTML = "✅ Login exitoso";
    } else {
      // Si hay error (usuario o contraseña incorrecta)
      document.getElementById("response").innerHTML = "❌ " + data.error;
    }
  } catch (err) {
    // Si falla la conexión con el backend
    document.getElementById("response").innerHTML = "⚠️ Error de conexión";
  }
}

// 📌 Función para acceder a la ruta protegida /perfil
async function getPerfil() {
  // Recuperamos el token guardado en localStorage
  const token = localStorage.getItem("token");

  // Si no hay token, no dejamos continuar
  if (!token) {
    document.getElementById("response").innerHTML = "⚠️ Debes iniciar sesión primero";
    return;
  }

  try {
    // Hacemos petición GET a la ruta protegida
    const res = await fetch(`${API_URL}/perfil`, {
      // Mandamos el token en el header "Authorization"
      headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (res.ok) {
      // Si el token es válido, mostramos el nombre del usuario
      document.getElementById("response").innerHTML = "👤 Usuario: " + data.user.username;
    } else {
      // Si el token es inválido o expiró
      document.getElementById("response").innerHTML = "❌ " + data.error;
    }
  } catch (err) {
    // Error de conexión con el backend
    document.getElementById("response").innerHTML = "⚠️ Error de conexión";
  }
}
