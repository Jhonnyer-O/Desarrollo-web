let saldo = 1000;
let montoRetiro = 1200;
let saldoActual;

if (montoRetiro <= saldo){
    saldoActual = saldo - montoRetiro;
    console.log(`El retiro ha sido exitoso, tenias en total ${saldo} y has retirado ${montoRetiro}, Actualmente cuentas con: ${saldoActual} `)
}else if(montoRetiro > saldo){
    console.log(`El retiro no ha sido exitoso, estas retirando un monto por encima de su saldo actual, intentas retirar ${montoRetiro}, Actualmente cuentas con: ${saldo} `)
}else{
    console.log(`Algo salio mal`);
}