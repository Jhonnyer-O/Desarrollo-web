//funcion que calcula el area y perimetro del cuadrado
const perimSquare = (side) => side * 4;
const areaSquare = (side) => side * side;

//funcion que calcula perimetro y area de un triangulo
const perimTriangle = (side1, side2, base) => side1 + side2 + base;
const areaTriangle = (base, height) => (base * height) / 2;

//área, perímetro y diametro de circulo 
 const diameCircle = (radio)=>radio*2;
const perimCircle = (radio) => diameCircle(radio) * Math.PI;
const areaCircle = (radio) => (radio * radio) * Math.PI;


function calcularPerimSquare(){
    let inputSide = document.getElementById('inputSide');
    let value = Number(inputSide.value);

    const result = `Èl perimetro del Cuadrado es: ${perimSquare(value)} CM`;
    document.getElementById('result').innerText = result;
}

function calcularAreaSquare(){
    let inputSide = document.getElementById('inputSide');
    let value = Number(inputSide.value);

    const result = `Èl area del Cuadrado es: ${areaSquare(value)} CM^2`;
    document.getElementById('result').innerText = result;
}

function calcularPerimetroTriangulo(){
    let input1 = document.getElementById('input1');
    let input2 = document.getElementById('input2');
    let input3 = document.getElementById('input3');

    let value1 = Number(input1.value);
    let value2 = Number(input2.value);
    let value3 = Number(input3.value);

    const result = `El perimetro del triangulo es: ${perimTriangle(value1,value2,value3)}`;
    document.getElementById('result').innerText = result;
}

function calcularAreaTriangulo(){
    let input1 = document.getElementById('side1');
    let input2 = document.getElementById('side2');

    let value1 = Number(input1.value);
    let value2 = Number(input2.value);
    
    const result = `El perimetro del triangulo es: ${areaTriangle(value1,value2)}`;
    document.getElementById('result').innerText = result;
}

function calcularDiametro(){

    let input1 = document.getElementById('sideR');
    let value1 = Number(input1.value);

    const result = `El Diametro del Circulo es: ${diameCircle(value1)}`;
    document.getElementById('result').innerText = result;

}

function calcularPerimetro(){

    let input1 = document.getElementById('sideR');
    let value1 = Number(input1.value);

    const result = `El Perimetro del Circulo es: ${perimCircle(value1)}`;
    document.getElementById('result').innerText = result;

}

function calcularArea(){

    let input1 = document.getElementById('sideR');
    let value1 = Number(input1.value);

    const result = `El Area del Circulo es: ${areaCircle(value1)}`;
    document.getElementById('result').innerText = result;

}