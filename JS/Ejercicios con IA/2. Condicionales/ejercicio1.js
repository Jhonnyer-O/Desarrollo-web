let edad = 78;

if (edad <= 17){
    console.log(`Eres menor de edad Tienes ${edad} años`);
}else if (edad => 18 && edad < 58){
    console.log(`Eres mayor de edad con ${edad} años de edad`);
}else if(edad => 59){
    console.log(`Eres un edulto mayor con ${edad} años de edad`);
}else{
    console.log(`Haz digitado mal`);
}