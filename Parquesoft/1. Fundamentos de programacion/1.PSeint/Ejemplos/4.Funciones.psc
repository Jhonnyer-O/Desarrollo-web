Funcion Saludar
    Escribir "Hola mundo!"
FinFuncion

Funcion res <- CalcularDoble(num)
    res <- num*2  // retorna el doble
FinFuncion

Algoritmo PruebaFunciones
	
    Escribir "Llamada a la funcion Saludar:"
    Saludar
	
    Escribir "Ingrese un valor numérico para x:"
    Leer x
	
    Escribir "Llamada a la función CalcularDoble (pasaje por valor)"
    Escribir "El doble de ", x, " es ", CalcularDoble(x)
    Escribir "El valor original de x es ", x
	
FinAlgoritmo