let compra = 20;
let esMiembro = true;

if (compra >= 100) {
    console.log("Costo de envío: GRATIS");
}
else if (esMiembro && compra >= 50) {
    console.log("Costo de envío: GRATIS");
}
else if (compra < 50) {
    console.log("Costo de envío: $10");
}