let usuarioCorrecto = "admin";
let passwordCorrecto = "1234";
let usuarioIngresado = "admin";
let passwordIngresado = "1234";

if( usuarioCorrecto == usuarioIngresado && passwordCorrecto == passwordIngresado){
    console.log(`usuario y contraseña son correctos`);
}else if (usuarioCorrecto == usuarioIngresado && passwordCorrecto != passwordIngresado){
    console.log(`si el usuario está bien pero la contraseña mal`);
}else{
    console.log(`si el usuario está mal`);
}