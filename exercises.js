//Задача 1
function factorio(n) {
    if (n < 1) {
        return 1;
    } else {
        return n * factorio(n-1);
    }
}
function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}
console.log(factorio(10));
console.log(factorial(10));

// Задача 2

var newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];

/* перебор прямой*/
function compareNum(a, b) {
    return a - b;
}
newArray.sort(compareNum);
console.log(newArray);
newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];
/* перебор обратный*/
function compareNum2(a, b) {
    return b - a;
}
newArray.sort(compareNum2);
console.log(newArray);
newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];
/* перебор по четным */
function evenSort(a){
    var nextArray = [];

    for (var i=0; i<a.length;i++){
        if (a[i] % 2 === 0)
        {
            nextArray.push(a[i]);
        }

    }

    return nextArray;
}
console.log(evenSort(newArray));
newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];
/* перебор по нечетным */
function evenSort2(a){
    var nextArray = [];

    for (var i=0; i < a.length;i++){
        if (a[i] % 2 > 0)
        {
            nextArray.push(a[i]);
        }

    }

    return nextArray;
}
console.log(evenSort2(newArray));
newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];
/* перебор каждого 3 */
function sortBy3(arr) {
    var nextArray = [];
    for (i = 0; i < arr.length; i = i + 3) {
        nextArray.push(arr[i])
    }
    return nextArray;
}
console.log(sortBy3(newArray));
/* перебор каждого 3 со 2  */

newArray = [48, 12, 5, 23, 17, 87, 45, 13, 34];
function sortBy3On1(arr) {
    var nextArray = [];
    for (i = 1; i < arr.length; i = i + 3) {
        nextArray.push(arr[i])
    }
    return nextArray;
}
console.log(sortBy3On1(newArray));


// Задача 4
function arrNumer(i, n) {
   var numbers = [];

   for(i ; i > 0 ;i--) {
       numbers[i] = [];
       for (n = 20, q = 0; n > 0; n--, q++){
           numbers[i][q] = n;
       }
   }
for (i = 1, q= 0, n = 0; i < 21; i++, n++) {
    numbers[i].splice(q, n);
}
   return numbers.join('\n');
}
console.log(arrNumer(20, 20));

//Задача 4
function arrNumer2(i) {
    var numbers = [];
    for(i; i > 0 ;i--) {
        numbers[i] = Array.apply(null, {length: i+1}).map(Number.call, Number).reverse();
        numbers[i].splice(i, 1);
    }
    return numbers.reverse().join('\n');
}
console.log(arrNumer2(20));


// Задача 5
var text = "Lorem ipsum dolor sit amet, ei mel prima signiferumque.\
Choro imperdiet intellegam an vis, his ludus labitur lobortis cu.\
Simul consetetur et vis, eos no partem luptatum.\
Quo ad regione mandamus, an viris hendrerit vix.\
Aperiam eligendi in vix, eam mutat brute eu.\
An mei sonet vitae patrioque\
Ut modus libris pri.\
Vix ex vidisse nonumes corpora, ius adhuc putant ut.\
Solum hendrerit eum te, vis hinc causae expetendis eu, quando tamquam duo et.\
Ea nam erant nemore vocent. \
Causae ornatus conceptam at per.\
Usu cu liber nostro, magna movet similique his in, ut vel postea discere.\
Pri ex viris tritani principes, ea mutat habemus civibus nam.\
Ex eos veri virtute, usu ex autem scribentur. \
Usu nonumy putant cu, case percipitur consectetuer no pri.\
Summo delenit dissentias eu per, posse essent everti ea mel.\
Harum salutandi persequeris in pri. Esse dissentiunt deterruisset ea eum. \
Nusquam volutpat te vix.\
Facer congue disputationi ex vix, audire omnesque accommodare et eam.\
Nulla noluisse vis ea, enim dolores blandit te est.\
Aliquam prodesset ei mea, te vis modus senserit.\
Id pri porro dicam eirmod, in his meis dicat blandit.";

function countWords(str, lt) {
    var regS = new RegExp(lt, 'ig');
    var arrayStr = str.split('.');
    function compareStr(item, i, arr) {
        for (i = 0; i < arr.length; i++) {
            if (arr[i].match(regS) == null) break;
            var res = arr[i].match(regS).length;
            console.log('In string number ' +i+ ' found letter ' +lt+ ", " +res +' times' );
        }
    }
    return arrayStr.every(compareStr);
}
console.log(countWords(text, 'a'));

// Задача 6

function wordTest(a) {
    if (a == 1 || a == 21 || a == 31 || a == 41 || a == 51 || a == 61 || a == 71 || a == 81 || a == 91) {
        console.log('задание');
    } else if (a < 5 && a != 1) {
        console.log('задания')
    } else  if (a > 4 && a < 100) {
        console.log('заданий')
    } else if (a > 99) {
        console.log('ошибка! недопустимое значение')
    }
}
wordTest(99);
// Задача 7
var readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var repeatQuestion = function () {
    rl.question(" Please enter expression, format type [n1 operation n2] or type exit: ", function (answer) {
        // close if 'exit'
        if (answer == 'exit')
            return rl.close();
        log(' Calculating expression: ' + answer);
        answer = answer.split(' ', 3);
        var num1 = +answer[0], op = answer[1], num2 = +answer[2];
        log(op);
        // if n1 or n2 = Nan or op isn't '+/-*' repeat
        if (isNaN(num1) == true && isNaN(num2) == true)
            return log('Error: n1 or n2 isn\'t number!'), repeatQuestion();
        if (op == '+' || op == '-' || op == '*' || op == '/') {
            if (op == '+') {
                return log('Your answer is: ' + num1+num2), repeatQuestion();
            } else if (op == '-'){
                return log('Your answer is: ' + num1-num2), repeatQuestion();
            } else if (op == '*'){
                return log('Your answer is: ' + num1*num2), repeatQuestion();
            } else if (op == '/'){
                return log('Your answer is: ' + num1/num2), repeatQuestion();
            } else {
                return log('Something goes wrong'), repeatQuestion();
            }
        } else {
            return log('operator is not valid!'), repeatQuestion();
        }
        repeatQuestion();
    });
};
repeatQuestion();

