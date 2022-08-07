import {object} from "./classes.js";

let todoListsave = [];
let t = document.getElementById("modeleListe");
let g = document.getElementById("g");
let p = document.getElementById("modeleDetail");
let todoList
if (localStorage.list) {
    todoList = JSON.parse(localStorage.list)
    triSelect();
    ajoutTab();
} else {
    todoList = [];
};

/**
*  Fonction ajout de tâche 
*/ 

export function ajoutTab() {
    let tache = document.getElementById("g");
    tache.innerHTML = "";
    for (let elt of todoList) {
        let tImport = document.importNode(t, true);
            for (let prop in elt) {
                tImport.innerHTML = tImport.innerHTML.replaceAll(`{${prop}}`, elt[prop]); 
            }
        g.appendChild(tImport.content);
    }
}

/**
 *  Fonction date et heure du moment 
 *  @return {string} 
 */ 

export function dateHeure() {
    let date = new Date()
    date = ("0"+date.getDate()).slice(-2)+"/"+("0"+(date.getMonth()+1)).slice(-2)+"/"+date.getFullYear()+","+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    return date
}

/**
 *  Fonction ajout de tâche au tableau
 */ 

export function addTodo() {
    let nom = document.querySelector("#myInput").value;
    if (nom == "") {
        alert("Vous n'avez entré aucune tâche.");
    } else {
        let todoObject = new object (nom,choixImportance(),dateHeure(),todoList.reduce((idMax, t) => Math.max(t.id , idMax), 0) + 1,"À faire");
        todoList.unshift(todoObject);
        todoList = triDeuxCriteres(todoList,"nom","importance");
        save();
        ajoutTab();
    }
}

/**
 *  Fonction sauvegarde des tâches 
 */ 

export function save() {
    todoListsave = JSON.stringify(todoList);
    localStorage.list = todoListsave;
}

/**
 *  Fonction de tri d'un tableau d'objet (La légendaire !!!)
 *  @param {array} tObjets.
 *  @param {string} critere.
 *  @param {string} sens.
 *  @return {array} 
 */ 

export function triDeuxCriteres(tObjets, critere1, critere2, sens1 = "asc", sens2="asc") {
    for (let objet of tObjets) {
        if (objet[critere1] === undefined) return false;
        if (objet[critere2] === undefined) return false;
    }
    tObjets.sort(function(obj1, obj2) {
        let ret1 = sens1 === "asc" ? 1 : -1;
        let ret2 = sens2 === "asc" ? 1 : -1;
        if (obj1[critere1] > obj2[critere1]) return ret1;  
        if (obj1[critere1] < obj2[critere1]) return -ret1; 
        if (obj1[critere2] > obj2[critere2]) return ret2;  
        if (obj1[critere2] < obj2[critere2]) return -ret2; 
        return 0;
    });
    return tObjets;
}

/**
 *  Fonction tri de la liste de tâches
 */ 

export function triSelect() {
    let x = document.getElementById("triSelect").selectedIndex;
    let tri = (document.getElementsByTagName("option")[x].value);
    if (tri === "1"){
        todoList = triDeuxCriteres(todoList,"nom","importance");
        save()
        ajoutTab();
    } else if (tri === "2"){
        todoList = triDeuxCriteres(todoList,"importance","nom");
        save()
        ajoutTab();
    }
}

/**
 *  Fonction de choix de l'importance de la tâche par l'utilisateur
 *  @return {int} tri, valeur de l'importance de la tâche
 */ 

export function choixImportance() {
    let x = document.getElementById("importance").selectedIndex;
    let tri = (document.getElementsByTagName("option")[x].value);
    return tri
}

/**
 *  Fonction de gestion au clic de l'état d'une tâche
 * @param {MouseEvent} evt
 */ 

export function gererClic(evt) {
    let e = evt.target;
    let objIndex = todoList.findIndex((obj => obj.id == e.dataset.id));
    if (e.dataset.fait === "À faire" && (todoList[objIndex].fait === "À faire")) {
        e.dataset.fait = "fait";
        todoList[objIndex].fait = "fait";
        save();
    } else if (e.dataset.fait === "fait" && (todoList[objIndex].fait === "fait")){
        e.dataset.fait = "À faire";
        todoList[objIndex].fait = "À faire";
        save();
    } else if (e.className === "effacer"){
        e.parentNode.parentNode.remove();
        objIndex = todoList.findIndex((obj => obj.id == e.parentNode.dataset.id));
        todoList.splice(objIndex,1);
        save();
        ajoutTab()
    } else if (e.className === "detail"){
        let detailIndex = todoList.findIndex((obj => obj.id == e.parentNode.dataset.id));
        let eDialog = document.getElementById("modale");
        let tImport = document.importNode(p, true);
            for (let prop in todoList[detailIndex]) {
                tImport.innerHTML = tImport.innerHTML.replaceAll(`{${prop}}`,todoList[detailIndex][prop]); 
            }
        eDialog.innerHTML = tImport.innerHTML;
        eDialog.showModal();
    }
}