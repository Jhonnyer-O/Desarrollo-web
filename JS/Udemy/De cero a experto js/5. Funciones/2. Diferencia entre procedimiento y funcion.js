// El procedimiento no retorna ningun valor:

function imprimir(parametro){
    console.log(parametro);
}

imprimir(100);


//Funcion retorna algun valor:

function sumar(a,b){
    let resultado = a+b;
    return resultado;
}

let a=2, b=10;
c = sumar(a,b);
console.log(c);