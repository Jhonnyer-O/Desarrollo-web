--Crear una base de datos:
CREATE DATABASE Nombre_del_BD;

--Ver las bases de datos creadas:
SHOW DATABASES;

--Ingreso a una base de datos:]
USE Nombre_del_BD;

--Creacion de una tabla de datos:
CREATE TABLE Nombre_de_Tabla (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20)
);

--Insetar datos dentro de la tabla:
INSERT INTO Nombre_de_Tabla (nombre, email, telefono)
VALUES ('Juan Pérez', 'juanp@gmail.com', '3001234567');

--Consulta de datos de la tabla:
SELECT * FROM Nombre_de_Tabla;