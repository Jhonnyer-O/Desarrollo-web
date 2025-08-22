const gradosCaK = (valor) => {
    return valor * 274.15;
}
console.log(gradosCaK(15));

//Tambien se pude de esta manera:
//const gradosCak = valor => valor * 274.15;

//Funcion anonima:

(function(){
    console.log("Funcion anonima");
})();

//Funcion flecha anonima:
(()=>{
    console.log("Funcion anonima con flecha");
})();