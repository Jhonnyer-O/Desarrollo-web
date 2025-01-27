

//Se decalara el arreglo 

let numerosArreglo = [13, 21, 0, 0, 62];


//se lee la cantidad de valores con .length

console.log(numerosArreglo.length); // Seria = 5, la cantidad de valores almacenados en el arreglo 


//Leer iterar o recorrer los valores del arreglo:

for(let x=0; x< numerosArreglo.length; x++){
	
	console.log(numerosArreglo[x]); //De esta forma recorre y muestra los datos que estan dentro del arreglo.
	
}


//imprimir toda la informacion del arreglo

for(let x=0; numerosArreglo.length; x++){
	console.log('Arreglo en :'+[x]+' = ' + numerosArreglo[x]);
}