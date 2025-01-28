//funciones recursivas son aquellas que se llaman a si mismas tantas veces como sea necesario

//imprimir 3, 2, 1-

function funcionRecursiva(num){
	//caso base
	if (num == 1){
		console.log(num);
	}else{
		console.log(num);
		funcionRecursiva(num-1);
	}
}

//llamamos la funcion recursiva

funcionRecursiva(3)