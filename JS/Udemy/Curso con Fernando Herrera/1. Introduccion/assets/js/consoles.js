let a = 10,
    d = 40,
    c = 30,
    b = 20,
    x = a + b;

//Existen varias formas de mostrar el mensaje en consola.

console.log(x);
//imprime como alerta
console.warn(x);
//Imprime como error
console.error(x);

//Imprime como objetos
console.log({a});
console.log({b});
console.log({c});

//Imprime coo tablas
console.table({a, b, c, d, x});
