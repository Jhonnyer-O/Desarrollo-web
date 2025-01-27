

let num;
let x=0+1;
let suma = 0;
let cant = parseInt(prompt("Ingrese la cantidad de numeros a sumar: "));

while ( x <= cant){
	
	num = parseInt(prompt("Ingrese el numero en: "+x));	
	suma += num;
	x=x+1;
}

console.log("La suma de todos los numeros es: "+suma);