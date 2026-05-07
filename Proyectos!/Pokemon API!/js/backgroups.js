// Arreglo con las URLs de los GIFs seleccionados para el fondo.
// Se pueden añadir o quitar enlaces aquí para variar las imágenes de la página.
const backgroundGifs = [
  "https://i.pinimg.com/originals/25/c4/f2/25c4f291da29d220a301670bc185b0d4.gif",
  "https://i.redd.it/rq6t5sirswxd1.gif",
  "https://i.pinimg.com/originals/22/42/61/22426121954f75296b101ec5218ac5aa.gif",
  "https://i.pinimg.com/originals/46/db/c2/46dbc2aea85be6082cafcba3958321bf.gif",
];

// Esta función se encarga de elegir un GIF al azar y establecerlo como fondo del sitio.
function changeBackground() {
  // Genero un índice aleatorio basado en la cantidad de GIFs disponibles en el arreglo.
  // Uso Math.random multiplicado por el total de elementos y lo redondeo hacia abajo con Math.floor.
  const randomGif =
    backgroundGifs[Math.floor(Math.random() * backgroundGifs.length)];

  // Accedo al estilo del body y actualizo la propiedad backgroundImage con el GIF seleccionado.
  document.body.style.backgroundImage = `url('${randomGif}')`;
}

// Llamo a esta función dentro de la lógica de búsqueda individual.
async function searchPokemon() {
  // Obtengo el nombre, lo limpio de espacios y lo paso a minúsculas.
  const name = pokemonInput.value.toLowerCase().trim();
  if (!name) return;

  // Ejecuto el cambio de fondo cada vez que inicio una búsqueda nueva.
  changeBackground();

  errorMsg.innerText = "";
  card.style.display = "none"; // Oculto la tarjeta previa mientras carga la nueva.

  try {
    // Realizo la petición a la API.
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokémon no encontrado");
    const data = await response.json();

    // Si la respuesta es exitosa, muestro la información en la tarjeta.
    renderCard(data);
  } catch (error) {
    // Muestro el error en pantalla si el Pokémon no existe.
    errorMsg.innerText = error.message;
  }
}

// Llamo a la función de cambio de fondo también al listar las generaciones.
async function listGenerations() {
  // Cambio el fondo para dar dinamismo al mostrar la lista masiva.
  changeBackground();

  card.style.display = "none"; // Oculto el detalle individual para priorizar la lista.
  errorMsg.innerText = "Cargando lista...";

  // (Continúa el proceso de fetch y creación de mini-tarjetas para la cuadrícula)
}

// Configuro que el fondo cambie automáticamente apenas termina de cargar la ventana.
window.onload = changeBackground;
