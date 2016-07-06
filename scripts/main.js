//var myHeading = document.querySelector('h1');
//myHeading.textContent = 'Hello World!';

//var iceCream = 'chocolat';
//if (iceCream === 'chocolate') {
//    alert('Yay!');
//}
//   else {
//     alert('awwwwww');
//}
//function multiply(num1, num2) { var result = num1 * num2; return result;}

//document.querySelector('html').onclick = function () {
//    alert('OUOUOUOU');
//}

//img changer
var myImgage = document.querySelector('img');

myImgage.onclick = function () {
    var mySrc = myImgage.getAttribute('src');
    if (mySrc === 'images/neo.jpg') {
        myImgage.setAttribute ('src', 'images/neo2.jpg');
    } else { myImgage.setAttribute ('src','images/neo.jpg');
    }
}
//Button master
var myButton = document.querySelector('button');
var myHeading = document.querySelector('h1');

//function setUserName() {
//    var myName = prompt('Please enter your name.');
//    localStorage.setItem('name', myName);
//}
if (!localStorage.getItem('name')){
    setUserName();
}   else {
    var storedName = localStorage.getItem ('name');
    myHeading.textContent = 'You are fagot' + storedName;
}
myButton.onclick = function () {
    setUserName();
}
// loop table of music
function howMany(selectObject) {
    var numberSelected = 0;
    for (var i = 0;i< selectObject.options.length; i++){
        if (selectObject.options[i].selected){
            numberSelected++;
        }
    }
    return numberSelected;
}

var btn =document.getElementById('btn');
btn.addEventListener('click',function () {
    alert('Выбрано элементов:'+ howMany(document.selectForm.musicTypes))
});

//время

function JSClock() {
    var time = new Date();
    var hour = time.getHours();
    var minute = time.getMinute();
    var seconds = time.getSeconds();
    var temp = "" + ((hour>12) ? hour - 12 : hour);
    if (hour == 0)
        temp = "12";
    temp += ((minute < 10) ? ":0" : ":") + minute;
    temp += ((second < 10 ) ? ":0" : ":") + second;
    temp+= (hour >= 12) ? "P.M." : "A.M.";
    return temp;
    alert(temp);
}

//function rFact(num){ if (num===0) return 1; else return num* rFact(num-1);} alert(rFact(promt()));


function Fact(num)
{
    var rval = 1; 
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}
alert(Fact(prompt()));

function sFact(num)
{
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

alert(sFact(prompt()));
