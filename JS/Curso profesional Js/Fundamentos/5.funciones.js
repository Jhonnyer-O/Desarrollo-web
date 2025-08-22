function suma() {
  console.log('Funcion suma inicia');

  let num1 = 4;
  let num2 = 6;

  let respuesta = num1 + num2;

  console.log(`Respuesta: ${respuesta}`);
  console.log('funcion suma terminada');
}
suma();

const resta = function () {
  console.log('inicio de script');
  let num1 = 20;
  let num2 = 32;
  let respuesta = num1 - num2;

  console.log(`Respuesta: ${respuesta}`);
  console.log('Fin del script resta');
};
resta();

function multiplicar(num1, num2) {
  if (isNaN(num2) || isNaN(num1)) {
    throw new Error('Los parametros deben ser numero');
  }
  const respuesta = num1 * num2;
  console.log(`Respuesta: ${respuesta}`);
}
multiplicar('10', '5');
