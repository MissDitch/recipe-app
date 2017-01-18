$(document).foundation()

var recNotify = document.getElementById("recNotify");
var bookList = document.getElementById("bookList");
var typeList = document.getElementById("typeList");

var recipeInput = document.getElementById("recipeInput");
var submButton = document.getElementById("submButton");
var ingrButton = document.getElementById("ingrButton");
var bookButton = document.getElementById("bookButton");
var typeButton = document.getElementById("typeButton");
var searchButton = document.getElementById("searchButton");

//recipeInput.addEventListener("keydown", clearWarning);
recipeInput.addEventListener("keydown", clearNotify);
submButton.addEventListener("click", storeRecipe);
ingrButton.addEventListener("click", addIngredient);
bookButton.addEventListener("click", addBook);
typeButton.addEventListener("click", addType);
searchButton.addEventListener("click", searchRecipe);
searchButton.addEventListener("click", clearNotify);

var ingrArray = ["koriander", "pecorino", "bosui", "slagroom"];
ingrArray.sort();

var bookArray = ["Smaak van mijn herinnering", "China Modern", "Big Book of Basics", "Joodse Keuken"];
bookArray.sort();

var typeArray = ["none", "vegetarian", "fish"];
var ingrChoices = [];
var recipeArray = [];

if (!localStorage.getItem("recipeArray")) {
  localStorage.setItem("recipeArray", JSON.stringify(recipeArray));
}
else {
  var recipeString = localStorage.getItem("recipeArray");
  recipeArray = JSON.parse(recipeString);
}

/*
function selectColor(e) {
  this.style.backgroundColor=this.options[this.selectedIndex].style.backgroundColor;
}   */

/* helper function for sort(), makes sorting of entries case-insensitive   */
function caseInsensitive(s1, s2) {
  var s1lower = s1.toLowerCase();
  var s2lower = s2.toLowerCase();
  return s1lower > s2lower? 1 : (s1lower < s2lower? -1 : 0);
}

function clearFormElements(formId)  {
    var nElements = formId.elements.length;
    for (var i = 0; i < nElements; i++)    {
        if (formId.elements[i].type === "text" || formId.elements[i].type === "textarea") {
            formId.elements[i].value = "";
        }

        if (formId.elements[i].type === "checkbox") {
           formId.elements[i].checked = false;
        }
/*
        if (formId.elements[i].type === "textarea") {
            formId.elements[i].value = "";
        }  */
    }
}

/* 
function clearWarning(e) {  
  recipeWarning.innerHTML = "";
}   */

function clearNotify(e) { 
  recNotify.innerHTML = "";
}

// helper function to check if item has already been inserted
function compare(newInput, array, warningElement) {
  warningElement.innerHTML = "";
  var different = true;

  for(var i = 0; i < array.length; i++) {
    if(newInput === array[i]) {
      warningElement.innerHTML = "This item is already in the list!";
      different = false;
    }
  }
  return different;
}

function addIngredient() {
  var ingredientInput = document.getElementById("ingredientInput");
  var ingrWarning = document.getElementById("ingrWarning");

  if (ingredientInput.value === "") {
    ingrWarning.innerHTML = "Please enter an ingredient!"
    return;
  }
  else {
    if (compare(ingredientInput.value, ingrArray, ingrWarning)) {
     ingrArray.push(ingredientInput.value);  //adds new ingredient to the array
     ingrArray.sort(caseInsensitive);
     buildCheckboxes(ingrArray);
     ingredientInput.value = "";
    }

  }
}
/* 
function addOption(input,array, list) {
   var text = input.value;
  array.push(text);
  array.sort(caseInsensitive);
  buildOptions(list, array);
  input.value = "";
}
*/
function addBook() {
  var bookInput = document.getElementById("bookInput");
  var bookWarning = document.getElementById("bookWarning");  
  var bookList = document.getElementById("bookList");
  //var text = bookInput.value;

  if (bookInput.value === "") {
    bookWarning.innerHTML = "Please enter a book title!"
    return;
  }
  if (compare(bookInput.value, bookArray, bookWarning) ) {
    bookArray.push(bookInput.value);
    bookArray.sort(caseInsensitive);
    buildOptions(bookList, bookArray);
    bookInput.value = "";
  }
}

function addType() {
  var typeInput = document.getElementById("typeInput");
  var typeWarning = document.getElementById("typeWarning");
  var text = typeInput.value;

  if (typeInput.value === "") {
    typeWarning.innerHTML = "Please enter a Recipe type!"
    return;
  }
  if (compare(text, typeArray, typeWarning)) {
    typeArray.push(text);
  //typeArray.sort(caseInsensitive); 
  buildOptions(typeList, typeArray);
  typeInput.value = "";
  }
}

//creates individual ingredient checkbox
function createCheckbox(text, index) {
  var div = document.createElement("div");
  var cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.setAttribute("id", "cbox" + index);
  cb.setAttribute("value", text);
  cb.addEventListener("click", ingredientChoice);

  var label = document.createElement("label");
  label.setAttribute("for", "cbox" + index );
  var node = document.createTextNode(text);

  label.appendChild(node);
  div.appendChild(cb);
  div.appendChild(label);
  return div;
}

//creates group of ingredient checkboxes
function buildCheckboxes(array) {
  var ingrForm = document.getElementById("ingrForm");
  ingrForm.innerHTML = "";

  var p = document.createElement("p");
  var text = document.createTextNode("Has ingredient:");
  p.appendChild(text);
  ingrForm.appendChild(p);
  var a = array;
  a.forEach(function(item, index) {
    var cbox = createCheckbox(item, index)
    ingrForm.appendChild(cbox);
  });
}
buildOptions(bookList, bookArray);
buildOptions(typeList, typeArray);
buildCheckboxes(ingrArray);

/* adds or removes chosen ingredients 
whenever user checks or unchecks ingredient checkboxes */
function ingredientChoice(e) {
  if (e.target.checked) {  
    ingrChoices.push(this.value);
  }
  else {  
    var index = ingrChoices.indexOf(this.value);
    if (index) { 
      ingrChoices.splice(index, 1); 
    }
  }
}

//creates individual option element
function createOption(text, list) {
  var option = document.createElement("option");
  option.text = text;
  option.addEventListener("change", ingredientChoice);
  list.add(option);
}

//creates dropdown 
function buildOptions(list, array) {
  list.length = 0;
  array.forEach(function(item, index) {
    createOption(item, list);
    list.setAttribute("size", 4 );  // list.length shows all items
    list[0].selected = "true";
  });
}

// constructor/prototype pattern
function Recipe(name,book,page,type,remark) {
  this.name = name;
  this.ingredients = [];
  this.book = book;
  this.page = page;
  this.type = type;
  this.remark = remark;
}
Recipe.prototype.type = "";
Recipe.prototype.remark = "";
Recipe.prototype.addIngredient = function(ingredient) {
  this.ingredients.push(ingredient);
};
Recipe.prototype.changeIngredients = function(ingredient) {
  for(var i = 0; i < this.ingredients.length; i++ ) {
      if (this.ingredients[i] === ingredient) {
        console.log("ingredient already here!");
        break;
      }
   }
  this.ingredients.push(ingredient);
};

/* executes when 'Store this info' button is clicked */
function storeRecipe(e) {
  e.preventDefault();
  var recipeWarning = document.getElementById("recipeWarning");
  var rForm = document.getElementById("rForm");
  var pageInput = document.getElementById("pageInput");
  var remarksArea = document.getElementById("remarksArea");

  recipeWarning.innerHTML = "";
  if (recipeInput.value == "") {
    recipeWarning.innerHTML = "Please give recipe a name!";
    rForm.recipeInput.focus();
    return;
  }
  var rec = recipeInput.value;
  var bookChoice =  bookList.value;
  var page = pageInput.value;
  var type = typeList.value;
  var rem = remarksArea.value;
  var newRec = new Recipe(rec, bookChoice, page, type, rem);

  ingrChoices.forEach(function(item,index) {
    newRec.addIngredient(item);
  });

 // showRecipe(newRec);
/*var gember = "gember";
  newRec.changeIngredients(gember);
   console.log(newRec);
  console.log(newRec.ingredients);
  var koriander = "koriander";
  newRec.changeIngredients(koriander);  */
  recipeArray.push(newRec);
  localStorage.setItem("recipeArray", JSON.stringify(recipeArray));
  console.log(recipeArray);
  clearFormElements(rForm);
  recNotify.innerHTML= "This info is stored!";
}

function showRecipe(recipe) {
  var result = document.getElementById("result");

  for(var prop in recipe) {

    if(recipe.hasOwnProperty(prop)  ) {  //&& newRec[prop] != ""
      if(recipe[prop] !== "" || recipe[prop].length !== 0) {

       var p = document.createElement("p");
       var text = document.createTextNode("recipe." + prop + " = " + recipe[prop]);
       p.appendChild(text);
       result.setAttribute("class", "show ");
       result.appendChild(p);
      }
    }
    //else break;
 }
}

function searchRecipe(e) {
  e.preventDefault();
  var chosen = document.getElementById("chosen");
  var searchWarning = document.getElementById("searchWarning");
  var result2 = document.getElementById("result2");
  var found = false;  
  
  searchWarning.innerHTML = "";
 // result2.addAttribute("class", "show");
  result2.innerHTML = "";
  var h2 = document.createElement("h2");
  var text = document.createTextNode("Recipes with  " + chosen.value);
  h2.appendChild(text);
  result2.appendChild(h2);
  
  recipeArray.forEach(function(item,index) {
    item.ingredients.forEach(function(entry,index){
      if (entry === chosen.value) {
       found = true;
       var p = document.createElement("p");
       var span = document.createElement("span");
       var text = document.createTextNode(item.name);
       span.appendChild(text);
       p.appendChild(span);
       var text = document.createTextNode(" in " + item.book + ", page " + item.page);
       p.appendChild(text);
       var br = document.createElement("br");
       p.appendChild(br);
       var text = document.createTextNode("type: " + item.type); // +  " remarks: " + item.remark
       p.appendChild(text);
       var br = document.createElement("br");
       p.appendChild(br);
       var text = document.createTextNode("remarks: " + item.remark);
       p.appendChild(text);

       result2.setAttribute("class", "small-12 medium-6 columns end show ");
       result2.appendChild(p);
          }
    });

  });
  if (!found) {
    result2.innerHTML = "";
    var h2 = document.createElement("h2");
    var text = document.createTextNode("Sorry, no recipes with " + chosen.value + " stored yet");
     h2.appendChild(text);
     result2.appendChild(h2);
  }
  clearFormElements(iForm);
}


var aboutApp = document.getElementById("aboutApp");
aboutApp.addEventListener("click", aboutThisApp);
var hidden = true;


function aboutThisApp(e) {   
  e.preventDefault();
  var showStory = document.getElementById("showStory");

  if (hidden) {
		aboutApp.innerHTML = "I've read enough";
		hidden = false;
	}
	else {
		aboutApp.innerHTML = "What's this about?";
		hidden = true;
	}
  showStory.innerHTML = "";
var string = "";
	var h4 = document.createElement("h4");
	h4.innerHTML = "About this app";
string = "Do you have some left over ingredients? <br />" +
"  Do you want to find recipes where those ingredients are used? <br/> " +
 " This app lets you store and find recipes by ingredients";
  var p = document.createElement("p");
  p.innerHTML = string;
  showStory.appendChild(h4);
	showStory.appendChild(p);
}
