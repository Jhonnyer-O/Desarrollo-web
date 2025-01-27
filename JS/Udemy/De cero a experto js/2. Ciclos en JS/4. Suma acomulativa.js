//Realizar la suma de los primeros 5 numeros utilizando un ciclo for.


let cant;
let suma = 0;

cant = parseInt(prompt("Por favor ingrese la cantidad de numeros a ingresar: "));

for(let x=1; x<=cant; x++){
	
	let num = parseInt(prompt("Por favor ingrese el numero en: "+x));
	suma +=num;
	
}

console.log("La suma de todos los numeros es: "+suma);