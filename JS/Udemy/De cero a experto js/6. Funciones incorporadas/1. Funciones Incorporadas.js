//Funciones incorporas

//Obtener el largo de de una cadena
let cadena1 = 'Hola';
console.log(cadena1.length);

//No podemos modificar una cadena en JS
//Las cadenas son inmutables.
cadena1[0] = 'x'; //En teoria deberia con esto cambiar a Xola, perno no.
console.log(cadena1); // Sigue imprimiendo Hola.

//Si podemos asignar una nueva cadena
cadena1 = 'adios';
console.log(cadena1); // se sobreescribe

// Recoder una cadena de caracter

for(let x=0; x<cadena1.length; x++){
	console.log(x+' - '+cadena1[x]);
}