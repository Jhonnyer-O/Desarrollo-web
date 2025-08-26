const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

// Clave para firmar token
const SECRET_KEY = "mi_clave_secreta";

//Usuario prueba en BD
const userBD = {
    userName: "admin",
    password: bcrypt.hashSync("123456", 10)  // Con la funcion hashSycn se encripta la contaseña
};

//login ruta
app.post("/login", (req, res) => {

    //Se extrae los datos que envia el login 
    const { username, password} = req.body;

    //Validar usurio
    if(username !== userBD.username){
        return res.status(401).json({error: "usuario no encontrado"});
    }

    //Validar contraseña
    const isPasswordValid = bcrypt.compareSync(password, userBD.password);
    if (!isPasswordValid){
        return res.status(401).json({error:"Contraseña erronea"});
    }

    //Genera el token con expiracion de 1 hora
    const token = jwt.sign({username}, SECRET_KEY, {expiresIn: "1h"});

    res.json({message: "Login exitoso", token});
});

// Ruta protegida de token

app.get("/´perfil", (req, res) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(403).json({error: "Token requerido"});

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({message: "Acceso permitido", user: decoded});
    } catch(err){
        res.status(401).json({error: "token invalido o expirado"});
    }

});

app.listen(3000, () => {

    console.log("Servidor corriendo en http://Localhost:3000 Vamos!");

});