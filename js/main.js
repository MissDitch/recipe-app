$(document).foundation()

var result = document.getElementById("result");
var result2 = document.getElementById("result2");
var bookList = document.getElementById("bookList");
var typeList = document.getElementById("typeList");

var recipeInput = document.getElementById("recipeInput");
var submButton = document.getElementById("submButton");
var ingrButton = document.getElementById("ingrButton");
var bookButton = document.getElementById("bookButton");
var typeButton = document.getElementById("typeButton");
var searchButton = document.getElementById("searchButton");

recipeInput.addEventListener("keydown", clearResult);
submButton.addEventListener("click", makeRecipe);
ingrButton.addEventListener("click", addIngredient);
bookButton.addEventListener("click", addBook);
typeButton.addEventListener("click", addType);
searchButton.addEventListener("click", searchRecipe);
searchButton.addEventListener("click", clearResult);

var ingrArray = ["koriander", "pecorino", "bosui", "slagroom"];
ingrArray.sort();

var bookArray = ["Smaak van mijn herinnering", "China Modern", "Big Book of Basics", "Joodse Keuken"];
bookArray.sort();

var typeArray = ["nothing in particular", "vegetarian", "fish"];
var ingrChoices = [];
var recipeArray = [];

/* // only use this if you want to clear localStorage
localStorage.setItem("recipeArray", JSON.stringify(recipeArray));

// and comment out the code below
*/

if (!localStorage.getItem("recipeArray")) {
  localStorage.setItem("recipeArray", JSON.stringify(recipeArray));
}
else {
  var recipeString = localStorage.getItem("recipeArray");
  recipeArray = JSON.parse(recipeString);
}


function init() {
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

  buildOptions(bookList, bookArray);
  buildOptions(typeList, typeArray);
  buildCheckboxes(ingrArray);

  var inputs = document.querySelectorAll("[type='text'], [type='textarea']");
  inputs.forEach(function(item,index) {
    item.addEventListener("keydown", clearMessage);
  });


}


/* helper function for sort(), makes sorting of entries case-insensitive   */
function caseInsensitive(s1, s2) {
  var s1lower = s1.toLowerCase();
  var s2lower = s2.toLowerCase();
  return s1lower > s2lower? 1 : (s1lower < s2lower? -1 : 0);
}

function clearFormElements(formId)  {  
    for (var i = 0, all = formId.elements.length; i < all; i++)    {
        if (formId.elements[i].type === "text" || formId.elements[i].type === "textarea") {
            formId.elements[i].value = "";
        }

        if (formId.elements[i].type === "checkbox") {
           formId.elements[i].checked = false;
        }
        buildOptions(bookList, bookArray);     
        buildOptions(typeList, typeArray);       
    }
}

function clearMessage(e) {  
  var messages = document.getElementsByTagName("small"); 
  for(var i = 0, all = messages.length; i < all; i++ ){
    messages[i].innerHTML = "";
  }  
}   

function clearResult(e) { 
  if (result.innerHTML !== "") {
    result.innerHTML = "";
  } 
}



/* --------------  EDITING OF FORM ITSELF  -----------------------*/ 
 

// helper function to check if item has already been inserted
function compare(newInput, array, warningElement) {
  warningElement.innerHTML = "";
  var different = true;

  for(var i = 0, all = array.length ; i < all; i++) {
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

function addBook() {
  var bookInput = document.getElementById("bookInput");
  var bookWarning = document.getElementById("bookWarning");  
  var bookList = document.getElementById("bookList");

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
    buildOptions(typeList, typeArray);
    typeInput.value = "";
  }
}

/* --------------  CREATION OF FORM ELEMENTS -----------------------*/ 

//creates individual ingredient checkbox
function createCheckbox(text, index) {
  var div = document.createElement("div");
  var cb = document.createElement("input");
  cb.setAttribute("type", "checkbox");
  cb.setAttribute("id", "cbox" + index);
  cb.setAttribute("value", text);
 // cb.addEventListener("change", ingredientChoice);
  div.appendChild(cb);

  var label = document.createElement("label");
  label.setAttribute("for", "cbox" + index );
  var node = document.createTextNode(text);

  label.appendChild(node); 
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

//creates individual option element
function createOption(text, list) {
  var option = document.createElement("option");
  option.text = text;
 // option.addEventListener("change", ingredientChoice);
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


/* --------------  CREATION OF RECIPE -----------------------*/ 

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


/* gathers all checked boxes at submission */
function chosenIngredients() {
  var array = document.querySelectorAll('input[type="checkbox"]');
  var checkboxValues = [];
  for (var i = 0, length = array.length; i < length; i++) {
    if (array[i].checked == true) {
      checkboxValues.push(array[i].value);
    }
  }
  return checkboxValues;
}


/* input is gathered for creation and storing of newly created recipe */
function makeRecipe(e) {
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
  if (page === "") { 
    page = "not specified";
  }
  var type = typeList.value;
  var rem = remarksArea.value;
  if (rem === "") { 
    rem = "not specified";
  }
  var newRec = new Recipe(rec, bookChoice, page, type, rem);

  var ingredients = chosenIngredients();
  ingredients.forEach(function(item,index) {
    newRec.addIngredient(item);
  });  

  showNewRecipe(newRec);

  recipeArray.push(newRec);
  localStorage.setItem("recipeArray", JSON.stringify(recipeArray));
  console.log(recipeArray);
  clearFormElements(rForm);
  ingrChoices.length = 0;
}


/* helper function displays heading that is displayed for search result or newly created recipe */
function createHeading(string) {
  var h2 = document.createElement("h2");
  var text = document.createTextNode(string);
  h2.appendChild(text);
  return h2;
}

/* helper function creates and formats recipe line that is displayed for search result or newly created recipe*/
function createRecipeItem(recipe) {  
  var p = document.createElement("p");
  var span = document.createElement("span");
  var text = document.createTextNode(recipe.name);
  //var recipe = recipe;
  span.appendChild(text);
  p.appendChild(span);  
  
  text = document.createTextNode(" in " + recipe.book + ", page: " + recipe.page);
  p.appendChild(text);
  var br = document.createElement("br");
  p.appendChild(br);
  var ingredients = "";
  var length = recipe.ingredients.length;
  for (var i = 0; i < length; i++) {
    ingredients += recipe.ingredients[i] + " ";
  }
  if (length === 0) { 
    ingredients = "not specified";
    }  
  text = document.createTextNode("ingredient(s): " + ingredients); 
  p.appendChild(text);
  br = document.createElement("br");
  p.appendChild(br);
  text = document.createTextNode("type: " + recipe.type); 
  p.appendChild(text);
  br = document.createElement("br");
  p.appendChild(br);
  text = document.createTextNode("remarks: " + recipe.remark);
  p.appendChild(text);  
  return p;
}

/* when button "Store this info" is clicked, the newly created recipe is shown */
function showNewRecipe(recipe) {
  var result = document.getElementById("result");
  result.setAttribute("class", "small-12 medium-6 columns end ");  
  
  var heading = createHeading("Your new recipe:");
  var p = createRecipeItem(recipe);

  var div = document.createElement("div");    
  div.setAttribute("class", "show"); 
  div.appendChild(heading);  
  div.appendChild(p);

  result.appendChild(div); 
}


/* --------------  SEARCH FOR RECIPES -----------------------*/ 

function searchRecipe(e) {
  e.preventDefault();
  var chosenInput = document.getElementById("chosenInput");
  var searchWarning = document.getElementById("searchWarning");  
  var ingredient = chosenInput.value;  
  if (ingredient === "") {
    searchWarning.innerHTML = "Please enter an ingredient!"
    return;
  }  
  searchWarning.innerHTML = "";
  result2.innerHTML = "";
  var heading = createHeading("Recipes with " + ingredient); 
  result2.appendChild(heading);

  displayRecipe(ingredient);  
}

function displayRecipe(ingredient) {
  var found = false;  
  result2.setAttribute("class", "small-12 medium-6 columns end  ");    
  var div = document.createElement("div");   
  div.setAttribute("class", "show");  
    
  recipeArray.forEach(function(item,index) {
    item.ingredients.forEach(function(entry,index){
      if (entry === ingredient) {
        found = true;
        var p = createRecipeItem(item);    
        div.appendChild(p);
      }
    });
  });
  result2.appendChild(div);

  if (!found) {
    result2.innerHTML = "";
    var heading = createHeading("Sorry, no recipes with " + ingredient + " stored yet");
    result2.appendChild(heading);
  }
  clearFormElements(iForm);
}




init();