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

//se accede normalmente asi:
console.log(persona.nombre);
//o
console.log(persona['apellido']);

for ( prop in persona){
    console.log(prop);
    console.log(persona[prop]);
}