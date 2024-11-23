/*
DESCRIPTION:
Write a simple function that takes as a parameter a date object and returns a boolean value representing whether the date is today or not.

Make sure that your function does not return a false positive by only checking the day.
*/ 

function isToday(date) {
    return (
        date.getFullYear() === new Date().getFullYear() &&
        date.getMonth() === new Date().getMonth() &&
        date.getDate() === new Date().getDate()
    );
}

// Example Usage:
const today = new Date();
console.log(isToday(today)); // true

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
console.log(isToday(tomorrow)); // false

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
console.log(isToday(yesterday)); // false


// Others Dev solutions
function isToday(date) {
    return new Date().toDateString() === date.toDateString();
}

function isToday(date) {
    var today = new Date();
    return date.toDateString() == today.toDateString();
}

function isToday(date) {
    var d = new Date();
    return (
        d.getDate() == date.getDate() && 
        d.getFullYear() == date.getFullYear() && 
        d.getMonth() == date.getMonth());
}

// Is the date today
function isToday(date) {
    //Code goes here.
    const today = new Date();
  
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }


//function name isToday 
//parameter date 
//return Boolean , true or false 

function isToday(date) {
    //create date object
    let today = new Date();//current date and time stored in d variable
    
    let inputDate = new Date(date); //date input
    
    //extract date parts YYYY-MM-
    
    // create new date object based on input value from date parameter
    let todayDate = new Date (today.getFullYear(),today.getMonth(), today.getDate());
    
    let inputDateOnly = new Date (inputDate.getFullYear(),inputDate.getMonth(), inputDate.getDate());
    
    //
    if(todayDate.getTime() === inputDateOnly.getTime()){
      return true;    
    }else{
      return false;
    }
  
  }
  
    console.log(isToday("2023/06/02")); //true
    console.log(isToday("1977/06/02")); //false
    console.log(isToday("1999/06/25")); //false

    function isToday(date) {
        var d = new Date()
          return d.toDateString() === date.toDateString() ? true : false
    }