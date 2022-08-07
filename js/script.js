import {addTodo, triSelect, gererClic} from "./fonctions.js";

document.getElementById("triSelect").onchange = triSelect;

let main = document.querySelector("main");
main.addEventListener("click", gererClic);

document.querySelector("#add_button").addEventListener("click", addTodo);
document.querySelector("#myInput").addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    addTodo();
    e.preventDefault();
    return false;
  }
});


