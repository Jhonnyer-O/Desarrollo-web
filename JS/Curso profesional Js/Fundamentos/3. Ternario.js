let likes = 5;

if (likes == 1 ){
    console.log(likes + ' like');
}else{
    console.log(likes + ' likes');
}

//De forma terneria mas rapida
(likes == 1) ? console.log(likes + ' like') : console.log(likes + ' likes');

// otra manera:
console.log((likes == 1) ? likes + ' like': likes + ' likes');