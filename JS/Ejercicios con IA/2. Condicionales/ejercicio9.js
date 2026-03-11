let compra = 50;
let total;

if (compra >= 200){
    total = compra - (compra * 0.20);
    console.log(`Tu compra fue de: ${compra}
Descuento aplicado: 20%
Total a pagar: ${total}`);
}
else if (compra >= 100){
    total = compra - (compra * 0.10);
    console.log(`Tu compra fue de: ${compra}
Descuento aplicado: 10%
Total a pagar: ${total}`);
}
else if (compra >= 50){
    total = compra - (compra * 0.05);
    console.log(`Tu compra fue de: ${compra}
Descuento aplicado: 5%
Total a pagar: ${total}`);
}
else{
    console.log(`Tu compra fue de: ${compra}
No tienes descuento`);
}