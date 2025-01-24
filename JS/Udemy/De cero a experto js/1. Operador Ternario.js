

//normalmente se realiza el codigo de esta manera
let num = 0;

if(num>0){
	console.log('valor positivo: '+num);
}else{
	console.log('Valor cero o negativo: '+num);
}

//En ternario se realiza de la siguiente manera:

let num2 = 10;

//la pirmera parte es si la condicion se cumple como un "if"| desde la segunda parte en ":" es si la condicon no cumple como si fuera "else"
(num2 > 0) ? console.log('positivo') : console.log('Negativo');