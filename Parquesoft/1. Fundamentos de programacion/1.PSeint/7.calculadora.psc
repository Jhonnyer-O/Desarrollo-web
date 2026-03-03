funcion res <-sumar(num1,num2) 
	res = num1+num2
FinFuncion

funcion res <-restar(num1,num2) 
	res = num1-num2
FinFuncion

funcion mul <-Multiplicar(num1,num2) 
	mul = num1*num2
FinFuncion

funcion div <-Dividir(num1,num2) 
	div = num1/num2
FinFuncion



Algoritmo calculadora
	
	Definir num1, num2 Como Real
    Definir opcion Como Entero
    Definir resultado Como Real
	
	Escribir "Ingrese el primer número:"
    Leer num1
    
    Escribir "Ingrese el segundo número:"
    Leer num2
	
	
	Escribir "Seleccione la operación:"
    Escribir "1. Sumar"
    Escribir "2. Restar"
    Escribir "3. Multiplicar"
    Escribir "4. Dividir"
    Leer opcion
	
	Segun opcion Hacer
        1:
            resultado <- Sumar(num1, num2)
            Escribir "Resultado: ", resultado
        2:
            resultado <- Restar(num1, num2)
            Escribir "Resultado: ", resultado
        3:
            resultado <- Multiplicar(num1, num2)
            Escribir "Resultado: ", resultado
        4:
            Si num2 <> 0 Entonces
                resultado <- Dividir(num1, num2)
                Escribir "Resultado: ", resultado
            Sino
                Escribir "Error: No se puede dividir entre cero"
            FinSi
        De Otro Modo:
            Escribir "Opción no válida"
    FinSegun
	
FinAlgoritmo