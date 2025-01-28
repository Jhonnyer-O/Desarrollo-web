//Paso por valor en js

//Pasando informacion de tipo primitivo (numerico, booleano, string)

function cambiarValor(parametro){
	parametro = 20;
}

let argumento = 10; //No se cambia el valor del argumento
let x = cambiarValor(argumento);
console.log(argumento);


//Paso por referencia
//Objetos (arrays) se pasan por referencia

function cambiarValores(parametro){
	
	parametro[0] = 20;
	
}
 
 //Llamada de la funcion
 
 let arreglo = [10];
 console.log('Antes de la funcion: '+arreglo[0]);
cambiarValores(arreglo);
console.log('Antes de la funcion: '+arreglo[0]); // Si cambia 