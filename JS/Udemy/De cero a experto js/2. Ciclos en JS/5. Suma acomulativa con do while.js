
let num;

let suma = 0;

do{
	
	num = parseInt(prompt("Por favor ingrese numero: "))
	suma += num;
	
}while(num != 0);

console.log("La suma de los numeros es: "+suma);