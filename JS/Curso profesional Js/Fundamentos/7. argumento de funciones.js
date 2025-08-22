function perimetro (...lados){
    let suma=0;
    for(let i=0; i<lados.length;i++){
        suma+=lados[i];
    }
    return suma;
}

console.log(`El erimeto de la figura es ${perimetro(2,4,5,6)}`);


const suma = function(...numeros){
    let suma=0;
    let cont = 0;
    while(cont<numeros.length){
        suma+=numeros[cont];
        cont++;
    }
    return suma;
}

console.log(`La suma es ${suma(2,4,5,6)}`);