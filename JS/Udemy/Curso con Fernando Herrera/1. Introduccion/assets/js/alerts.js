//Tres tipos de ingreso de informacion del usuario

alert('Prueba');

let nombre = prompt('Cual es su nombre?', 'Digite aqui su nombre');

console.log('Bienvenido ' + nombre);


const confirmar = confirm('seguro quiere cancelar?');

if (confirmar == true){
    console.log('Has tomado la decision de cancelar');
}else{
    console.log('Has decidido omitir la cancelacion');
}

