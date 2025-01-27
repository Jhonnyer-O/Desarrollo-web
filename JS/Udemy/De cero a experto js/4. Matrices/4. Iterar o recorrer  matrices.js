
let matriz = [[100,200,300],[400,500,600, 1000]];


/*
//Validar los reglones:
console.log(matriz.length); // = 2

//Calidar numero de columnas:
console.log(matriz[0].length); // = 3
console.log(matriz[1].length); // = 4

*/

//renglones
for(let x=0; x<matriz.length;x++){
	
	//columnas
	for(let y=0; y<matriz[x].length;y++){
		
		console.log(matriz[x][y]);
	}
}

/*
	Reglones =     0               1          
let matriz = [[100,200,300],[400,500,600, 1000]];
	Columnas =  0  , 1 , 2  - 0 , 1 , 2 , 3
	
*/