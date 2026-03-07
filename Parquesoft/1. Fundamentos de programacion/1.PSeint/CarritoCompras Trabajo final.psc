Proceso CarritoCompras
	
	Definir nombreProducto Como Cadena
	Definir precioProducto Como Real
	Definir totalCompra Como Real
	Definir continuar Como Cadena
	
	totalCompra <- 0
	
	Repetir
		
		nombreProducto <- PedirNombreProducto()
		
		precioProducto <- PedirPrecioProducto()
		
		totalCompra <- SumarTotal(totalCompra, precioProducto)
		
		continuar <- PreguntarContinuar()
		
	Hasta Que continuar = "N" O continuar = "n"
	
	MostrarTotal(totalCompra)
	
FinProceso


Funcion nombre <- PedirNombreProducto
	
	Definir nombre Como Cadena
	
	Escribir "Ingrese el nombre del producto:"
	Leer nombre
	
FinFuncion


Funcion precio <- PedirPrecioProducto
	
	Definir precio Como Real
	
	Escribir "Ingrese el precio del producto:"
	Leer precio
	
FinFuncion


Funcion total <- SumarTotal(totalActual, precioProducto)
	
	Definir total Como Real
	
	total <- totalActual + precioProducto
	
FinFuncion


Funcion respuesta <- PreguntarContinuar
	
	Definir respuesta Como Cadena
	
	Repetir
		
		Escribir "¿Desea agregar otro producto? S(Si) o N(No)"
		Leer respuesta
		
		Si respuesta <> "S" Y respuesta <> "s" Y respuesta <> "N" Y respuesta <> "n" Entonces
			Escribir "Opcion invalida. Ingrese S(Si) o N(No)."
		FinSi
		
	Hasta Que respuesta = "S" O respuesta = "s" O respuesta = "N" O respuesta = "n"
	
FinFuncion


Funcion MostrarTotal(totalCompra)
	
	Escribir "=============================="
	Escribir "TOTAL DE LA COMPRA: ", totalCompra
	Escribir "Gracias por su compra"
	Escribir "Programa finalizado"
	
FinFuncion