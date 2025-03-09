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

//Para agragar una nueva propiedad solo se realiza lo siguiente:
persona.tel = '3001002342';

// se puede llegar a sobre escribir
persona.tel = '3145679090';

//De esta manera se elimina una propiedad de un objeto.

delete persona.tel;


console.log(persona);
