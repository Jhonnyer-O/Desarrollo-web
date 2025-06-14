function cambiarBoxSizing() {
  const caja = document.getElementById("caja");
  const texto = document.getElementById("texto");

  if (caja.classList.contains("content-box")) {
    caja.classList.remove("content-box");
    caja.classList.add("border-box");
    texto.textContent = "Modo actual: border-box";
  } else {
    caja.classList.remove("border-box");
    caja.classList.add("content-box");
    texto.textContent = "Modo actual: content-box";
  }
}