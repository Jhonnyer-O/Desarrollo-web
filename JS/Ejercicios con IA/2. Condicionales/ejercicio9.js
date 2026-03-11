let compra = 50;

if(compra >= 200){
  Desc = compra - (compra * 0.20)
    console.log(`Tu compra fue de: ${compra}
        Descuento aplicado: 20%
        Total a pagar: ${Desc}`);
}else if(compra >= 100){
    Desc = compra - (compra * 0.10);
    console.log(`Tu compra fue de: ${compra}
        Descuento aplicado: 10%
        Total a pagar: ${Desc}`);
}else{
    Desc = compra - (compra * 0.05)
    console.log(`Tu compra fue de: ${compra}
        Descuento aplicado: 5%
        Total a pagar: ${Desc}`);
}