// Los objetos se crean de la siguiente manera:
//aL crear un obbjeto se almacena un espacio en la memoria. que contiene una referencia

let persona = {
    nombre: 'Maria',
    apellido: 'Murillo',
    correo: 'Isamaria@mail.com',
    edad: 20,

    //Se le agrega una funcion  para concatenar el nombre completo
    nombreCompleto: function(){
        return this.nombre + ' ' + this.apellido;
    }

}

// De la siguiente manera se puede acceder al valor del objeto:

console.log(persona.nombre);
console.log(persona.apellido);
console.log(persona.correo);
console.log(persona.edad);

// Y de esta forma se accede al objeto con la informacion completa

console.log(persona);


//Se llama a la funcion
console.log(persona.nombreCompleto());

//Creacion de un nuevo objeto
let persona2 = new Object();
persona2.nombre = 'Jhonnyer';
persona2.direccion = 'Cra 1A4';
persona2.tel = '3186969';

console.log(persona2.nombre);
console.log(persona2.direccion);