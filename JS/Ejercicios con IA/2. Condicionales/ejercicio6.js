let membresia = true;
let pagoMes = false;
let edad = 15;

if(edad < 15){
    console.log('Eres muy joven, no puedes entrar al gimnasio');
}
else if(membresia && pagoMes){
    console.log('Bienvenido al gimnasio');
}
else if(membresia && !pagoMes){
    console.log('Debes pagar el mes para entrenar');
}
else if(!membresia){
    console.log('Debes comprar una membresía');
}