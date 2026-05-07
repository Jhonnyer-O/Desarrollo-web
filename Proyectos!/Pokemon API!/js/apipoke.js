// Defino la URL base de la API para no tener que escribirla cada vez que haga una petición.
const BASE_URL = "https://pokeapi.co/api/v2";

// Capturo los elementos del HTML que necesito controlar para que la página sea interactiva.
const pokemonInput = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");
const listGenBtn = document.getElementById("listGenBtn");
const card = document.getElementById("pokemon-card");
const listContainer = document.getElementById("pokemon-list-container");
const pokeGrid = document.getElementById("poke-grid");
const errorMsg = document.getElementById("error-msg");

// Uso una función asíncrona para buscar la información del Pokémon por su nombre.
async function searchPokemon() {
  // Tomo el texto que escribí, lo paso a minúsculas y limpio espacios extra.
  const name = pokemonInput.value.toLowerCase().trim();

  // Si dejé el campo vacío, detengo la función inmediatamente.
  if (!name) return;

  // Limpio cualquier error anterior y oculto la lista para priorizar la tarjeta de detalle.
  errorMsg.innerText = "";
  listContainer.style.display = "none";

  try {
    // Intento obtener los datos desde el servidor de la API.
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);

    // Lanzo un error si la respuesta no es exitosa (por ejemplo, si escribí mal el nombre).
    if (!response.ok) throw new Error("Pokémon no encontrado");

    // Proceso los datos recibidos convirtiéndolos a un objeto de JavaScript.
    const data = await response.json();

    // Envío los datos a la función encargada de dibujar la información en pantalla.
    renderCard(data);
  } catch (error) {
    // Si ocurre un problema, muestro el mensaje de error y me aseguro de ocultar la tarjeta.
    errorMsg.innerText = error.message;
    card.style.display = "none";
  }
}

// Registro los iconos que quiero mostrar según el tipo elemental que tenga el Pokémon.
const typeIcons = {
    fire: '🔥', water: '💧', grass: '🌿', electric: '⚡', ice: '❄️',
    fighting: '🥊', poison: '☠️', ground: '⛰️', flying: '💨', psychic: '🔮',
    bug: '🐞', rock: '🪨', ghost: '👻', dragon: '🐲', dark: '🌙',
    steel: '⚙️', fairy: '✨', normal: '🔘'
};

// Diccionario para traducir los tipos al español
const typeTranslations = {
    fire: 'Fuego', water: 'Agua', grass: 'Planta', electric: 'Eléctrico', 
    ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', 
    flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', 
    ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro', steel: 'Acero', 
    fairy: 'Hada', normal: 'Normal'
};

// Esta función se encarga de organizar y mostrar los datos dentro de la tarjeta principal.
function renderCard(data) {
  // Identifico el tipo principal para poder usar su color específico en el resto de la tarjeta.
  const primaryType = data.types[0].type.name;

  // Genero el código HTML para los tipos, incluyendo su icono y clase de color.
  const typesHtml = data.types.map(t => {
    const typeName = t.type.name;
    const icon = typeIcons[typeName] || '❓';
    const nameSpanish = typeTranslations[typeName] || typeName; // Busco la traducción
    return `<span class="type-badge type-${typeName}">${icon} ${nameSpanish}</span>`;
}).join(' ');

  // Inserto los bloques de tipo que generé en su contenedor correspondiente.
  document.getElementById("poke-type").innerHTML = typesHtml;

  // Genero las etiquetas de habilidades usando el color del tipo principal.
  const abilitiesHtml = data.abilities
    .map((a) => {
      // Reviso si la habilidad es oculta para aplicarle un estilo visual diferente.
      const isHidden = a.is_hidden ? "hidden-ability" : "";
      // Reemplazo guiones por espacios para que los nombres de las habilidades se lean mejor.
      return `<span class="ability-badge type-${primaryType} ${isHidden}">${a.ability.name.replace("-", " ")}</span>`;
    })
    .join(" ");

    

  // Cargo las habilidades en el elemento de la interfaz.
  document.getElementById("poke-abilities").innerHTML = abilitiesHtml;

  // Actualizo el nombre y busco la imagen oficial de alta calidad en los datos recibidos.
  document.getElementById("poke-name").innerText = data.name;
  document.getElementById("poke-img").src =
    data.sprites.other["official-artwork"].front_default;

  // Convierto la altura y el peso a unidades estándar (metros y kilogramos).
  document.getElementById("poke-height").innerText = `${data.height / 10} m`;
  document.getElementById("poke-weight").innerText = `${data.weight / 10} kg`;

  // Muestro el valor de la experiencia base que otorga el Pokémon.
  document.getElementById("poke-exp").innerText = data.base_experience;

  // Localizo el valor de los puntos de vida (HP) dentro del arreglo de estadísticas.
  const hpStat = data.stats.find((s) => s.stat.name === "hp");
  document.getElementById("poke-hp").innerText = hpStat.base_stat;

  // Hago que la tarjeta sea visible ahora que ya tiene toda la información cargada.
  card.style.display = "block";
}

// Con esta función obtengo una lista masiva que cubre desde la primera hasta la cuarta generación.
async function listGenerations() {
  // Oculto la tarjeta de detalle y preparo la cuadrícula limpiando cualquier contenido previo.
  card.style.display = "none";
  errorMsg.innerText = "Cargando lista...";
  pokeGrid.innerHTML = "";

  try {
    // Pido a la API los primeros 493 registros para mostrar la lista completa.
    const response = await fetch(`${BASE_URL}/pokemon?limit=493`);
    const data = await response.json();

    // Recorro cada resultado para crear un elemento visual pequeño en la cuadrícula.
    data.results.forEach((pokemon, index) => {
      const id = index + 1;
      const miniCard = document.createElement("div");
      miniCard.className = "mini-card";

      // Defino el contenido de la mini tarjeta con su imagen de sprite y su número de índice.
      miniCard.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}">
                <p>#${id} ${pokemon.name}</p>
            `;

      // Programo que al hacer clic en una mini tarjeta se dispare automáticamente la búsqueda detallada.
      miniCard.onclick = () => {
        pokemonInput.value = pokemon.name;
        searchPokemon();
      };

      // Agrego la mini tarjeta que acabo de crear al contenedor de la cuadrícula.
      pokeGrid.appendChild(miniCard);
    });

    // Limpio el mensaje de carga y muestro la lista completa de Pokémon.
    errorMsg.innerText = "";
    listContainer.style.display = "block";
  } catch (error) {
    // Si la carga masiva falla, aviso al usuario con un mensaje de error.
    errorMsg.innerText = "Error al cargar la lista.";
  }
}

// Asigno las funciones a los eventos de clic de los botones principales.
searchBtn.addEventListener("click", searchPokemon);
listGenBtn.addEventListener("click", listGenerations);

// Configuro el buscador para que también funcione al presionar la tecla Enter mientras escribo.
pokemonInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchPokemon();
});
