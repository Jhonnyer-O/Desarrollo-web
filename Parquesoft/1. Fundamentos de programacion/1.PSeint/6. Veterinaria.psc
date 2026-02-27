Algoritmo Veterinaria
    
    Definir tipoAnimal, servicio Como Entero
    
    Escribir "=== Bienvenido a la Veterinaria Canina ==="
    Escribir "Seleccione el tipo de animal:"
    Escribir "1. Perros"
    Escribir "2. Gatos"
    Escribir "3. Aves"
    Leer tipoAnimal
    
    Segun tipoAnimal Hacer
        
        1:
            Escribir "=== SERVICIOS PARA PERROS ==="
            
            Escribir "Seleccione el servicio:"
            Escribir "1. Alimentos"
            Escribir "2. Juguetes"
            Escribir "3. Esterilizacion"
            Escribir "4. Vacunas"
            Escribir "5. Spa"
            Leer servicio
            
            Segun servicio Hacer
                
                1:
                    Escribir "ALIMENTOS PARA PERROS:"
                    Escribir "Concentrado Premium"
                    Escribir "Concentrado para cachorros"
                    Escribir "Alimento humedo"
                    Escribir "Snacks nutricionales"
					
                2:
                    Escribir "JUGUETES PARA PERROS:"
                    Escribir "Pelotas"
                    Escribir "Huesos de goma"
                    Escribir "Cuerdas"
                    Escribir "Juguetes interactivos"
					
                3:
                    Escribir "Servicio de esterilizacion para perros"
                    Escribir "Incluye evaluacion medica y cirugia segura"
					
                4:
                    Escribir "VACUNAS PARA PERROS:"
                    Escribir "Vacuna contra la rabia"
                    Escribir "Vacuna multiple"
                    Escribir "Vacuna contra el parvovirus"
					
                5:
                    Escribir "SPA PARA PERROS:"
                    Escribir "Baño medicado"
                    Escribir "Corte de pelo"
                    Escribir "Limpieza de oidos"
                    Escribir "Corte de uñas"
					
                De Otro Modo:
                    Escribir "Opcion no valida"
                    
            FinSegun
            
        2:
            Escribir "=== SERVICIOS PARA GATOS ==="
            
            Escribir "Seleccione el servicio:"
            Escribir "1. Alimentos"
            Escribir "2. Juguetes"
            Escribir "3. Esterilizacion"
            Escribir "4. Vacunas"
            Escribir "5. Spa"
            Leer servicio
            
            Segun servicio Hacer
                
                1:
                    Escribir "ALIMENTOS PARA GATOS:"
                    Escribir "- Concentrado premium"
                    Escribir "- Alimento humedo"
                    Escribir "- Snacks"
					
                2:
                    Escribir "JUGUETES PARA GATOS:"
                    Escribir "Ratones de juguete"
                    Escribir "Pelotas"
                    Escribir "Rascadores"
					
                3:
                    Escribir "Servicio de esterilizacion para gatos"
					
                4:
                    Escribir "VACUNAS PARA GATOS:"
                    Escribir "Vacuna triple felina"
                    Escribir "Vacuna contra la rabia"
					
                5:
                    Escribir "SPA PARA GATOS:"
                    Escribir "Baño especial"
                    Escribir "Corte de uñas"
					
                De Otro Modo:
                    Escribir "Opcion no valida"
                    
            FinSegun
            
        3:
            Escribir "=== SERVICIOS PARA AVES ==="
            
            Escribir "Seleccione el servicio:"
            Escribir "1. Alimentos"
            Escribir "2. Juguetes"
            Escribir "3. Esterilizacion"
            Escribir "4. Vacunas"
            Escribir "5. Spa"
            Leer servicio
            
            Segun servicio Hacer
                
                1:
                    Escribir "ALIMENTOS PARA AVES:"
                    Escribir "Semillas"
                    Escribir "Alimento balanceado"
                    Escribir "Vitaminas"
					
                2:
                    Escribir "JUGUETES PARA AVES:"
                    Escribir "Columpios"
                    Escribir "Espejos"
                    Escribir "Campanas"
					
                3:
                    Escribir "Servicio no disponible para aves"
					
                4:
                    Escribir "VACUNAS PARA AVES:"
                    Escribir "Vacunas preventivas segun especie"
					
                5:
                    Escribir "SPA PARA AVES:"
                    Escribir "Limpieza y cuidado de plumas"
					
                De Otro Modo:
                    Escribir "Opcion no valida"
                    
            FinSegun
            
        De Otro Modo:
            Escribir "Tipo de animal no valido"
            
    FinSegun
	
FinAlgoritmo