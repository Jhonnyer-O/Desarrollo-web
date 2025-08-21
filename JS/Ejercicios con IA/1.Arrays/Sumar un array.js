const numeros = [1, 2, 3, 4, 5];

function sumarArrays(arr){
    let suma=0;

    for(i=0; i < arr.length; i++){
        suma+=arr[i];
    }
    return suma;
}
console.log(sumarArrays(numeros));