let num1 = 10;
let num2 = 5;
let ope= "+";

switch (ope){
    
    case "-":   
        calc = num1 - num2;
        console.log(`La resta es: ${calc}`);
        break;

    case "+":   
        calc = num1 + num2;
        console.log(`La suma es: ${calc}`);
        break;

    case "*":   
        calc = num1 * num2;
        console.log(`La multiplicación es: ${calc}`);
        break;

    case "/":   
        calc = num1 / num2;
        console.log(`La división es: ${calc}`);
        break;

    default:
        console.log("Operación no válida");
}