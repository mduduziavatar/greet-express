document.addEventListener("DOMContentLoaded", function() {
    let errorsElem = document.querySelector(".errors")
    let countElem = document.querySelector(".counter")
    let textItem = document.getElementById(".txtBox")
    if (errorsElem.innerHTML !== "") {
        setTimeout(function() {
            errorsElem.innerHTML = "";
        }, 3000);
        // setTimeout(function() {
        //     countElem.innerHTML = "";
        // }, 5000);
        setTimeout(function() {
            textItem.innerHTML = "";
        }, 5000);
    };
});