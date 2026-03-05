Proceso CarritoTecnologia
	
    Definir opcion, contador Como Entero
    Definir nombres, precios Como Entero
    Definir i, posicion Como Entero
    Definir total Como Entero
    
    Dimension nombres[100]
    Dimension precios[100]
    
    contador <- 1
    
    Repetir
        
        Escribir "===== TIENDA TECNOLOGIA ====="
        Escribir "1. Agregar producto"
        Escribir "2. Mostrar carrito"
        Escribir "3. Eliminar producto"
        Escribir "4. Calcular total"
        Escribir "5. Salir"
        Leer opcion
        
        Segun opcion Hacer
            
            1:
                Escribir "1. Computador mesa - 10000"
                Escribir "2. Portatil - 8000"
                Escribir "3. Mouse - 100"
                Escribir "4. Teclado - 1500"
                Escribir "5. Monitor - 5000"
                Leer opcion
                
                Segun opcion Hacer
                    
                    1:
                        nombres[contador] <- 1
                        precios[contador] <- 10000
                    2:
                        nombres[contador] <- 2
                        precios[contador] <- 8000
                    3:
                        nombres[contador] <- 3
                        precios[contador] <- 100
                    4:
                        nombres[contador] <- 4
                        precios[contador] <- 1500
                    5:
                        nombres[contador] <- 5
                        precios[contador] <- 5000
                    De Otro Modo:
                        Escribir "Opcion invalida"
                FinSegun
                
                Si opcion >= 1 Y opcion <= 5 Entonces
                    contador <- contador + 1
                    Escribir "Producto agregado"
                FinSi
                
            2:
                Si contador = 1 Entonces
                    Escribir "Carrito vacio"
                SiNo
                    Para i <- 1 Hasta contador - 1 Hacer
                        
                        Segun nombres[i] Hacer
                            1: Escribir i, ". Computador mesa - ", precios[i]
                            2: Escribir i, ". Portatil - ", precios[i]
                            3: Escribir i, ". Mouse - ", precios[i]
                            4: Escribir i, ". Teclado - ", precios[i]
                            5: Escribir i, ". Monitor - ", precios[i]
                        FinSegun
                        
                    FinPara
                FinSi
                
            3:
                Si contador = 1 Entonces
                    Escribir "Carrito vacio"
                SiNo
                    Escribir "Ingrese numero a eliminar:"
                    Leer posicion
                    
                    Si posicion >= 1 Y posicion < contador Entonces
                        
                        Para i <- posicion Hasta contador - 2 Hacer
                            nombres[i] <- nombres[i + 1]
                            precios[i] <- precios[i + 1]
                        FinPara
                        
                        contador <- contador - 1
                        Escribir "Producto eliminado"
                    SiNo
                        Escribir "Posicion invalida"
                    FinSi
                FinSi
                
            4:
                total <- 0
                
                Para i <- 1 Hasta contador - 1 Hacer
                    total <- total + precios[i]
                FinPara
                
                Escribir "Total a pagar: ", total
                
            5:
                Escribir "Gracias por su compra"
                
            De Otro Modo:
                Escribir "Opcion invalida"
                
        FinSegun
        
    Hasta Que opcion = 5
	
FinProceso