//Paso de cadenas

//Cadenas inmutables en js (qno se puede modificar)

function cambiarValor(parametro){
	
	parametro = 'Adios';
	
}

//llamada de funcion

let argumento = 'Hola';
argumento = 'Hola Mundo';
console.log('Antes de funcion: '+argumento);

cambiarValor(argumento);
console.log('Despues de funcion: '+argumento);