
const apiKey = "21b612134db24ae285c7a2db190c41fc";
let searchURL = "https://api.spoonacular.com/recipes/complexSearch";

function displayResults(responseJson){
console.log(responseJson);
  $('.list').append(`
  
  <li>
    <h2>${responseJson.title}</h2>
    <div class="short-recipe-container">
    <img src="${responseJson.image}" alt="${responseJson.title}" class="recipe-image-short">
    <p>Serving Size: ${responseJson.servings}</p>
    </div>
  </li>
  `);

  $('#results').show();

}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function getRecipes() {

  let searchTerm = $('#recipe').val();

  let exclusions = [];
  $('.dropdown-contentA input[type="checkbox"]:checked').each(function(){
    exclusions.push($(this).val());
  })
  let exclude = exclusions.join(',');

  let allergy = [];
  $('.dropdown-contentB input[type="checkbox"]:checked').each(function(){
    allergy.push($(this).val());
  })
  let allergies = allergy.join(',');

  const params = {
    apiKey: apiKey,
    query: searchTerm,
    number: 2,
    intolerances: allergies,
    excludeIngredients: exclude
    
  };
    
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  console.log(url)
   
  fetch(url)
    .then(response => response.json())
    .then(responseJson => getDetails(responseJson))
    .catch(error => console.log(error));
    
}

function getDetails(responseJson) {
  console.log(responseJson)
  for (let i = 0; i < responseJson.results.length; i++) {

    fetch(
      `https://api.spoonacular.com/recipes/${responseJson.results[i].id}/information?includeNutrition=false&apiKey=21b612134db24ae285c7a2db190c41fc`
    )
      .then(response => response.json())
      .then(responseJson => displayResults(responseJson))
      .catch(error => console.log(error));
  }
}

function populateDropdowns(){

  let exclude = STORE.exclusions;
  for (let i = 0; i < exclude.length; i++ ){
    $('#myExclusion').append(`
    <label class="drop-items ${exclude[i]}"><input type="checkbox" name="exclusion" value="${exclude[i]}">${exclude[i]}</label>
    `)
  }

  let allergy = STORE.allergies;
  for (let i = 0; i < allergy.length; i++ ){
    $('#myIntolerance').append(`
    <label class="drop-items ${allergy[i]}"><input type="checkbox" name="exclusion" value="${allergy[i]}">${allergy[i]}</label>
    `)
  }

  $('.Other').html
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    $(".list").empty();
    $(".err-js").empty();
    $("#results").hide();
    $(".sorry").remove();
    getRecipes();
  });

}

$(function() {
  console.log("App loaded! Waiting for submit!");
  $("#results").hide();
  populateDropdowns();
  watchForm();
  
  console.log(STORE.exclusions)
});

// creates the toggle effect for dropdown menus

$(function toggleDropdown() {

  $("#exclusion-button").click(function() {
    $("#myExclusion").toggle();
  });

  $("#intolerance-button").click(function() {
    $("#myIntolerance").toggle();
  });

  $(document).on("click", function(event) {
    let trigger = $("#exclusion-button")[0];
    let dropdown = $("#myExclusion");
    if (dropdown !== event.target && !dropdown.has(event.target).length && trigger !== event.target) {
      $("#myExclusion").hide();
    }
    let trigger2 = $("#intolerance-button")[0];
    let dropdown2 = $("#myIntolerance");
    if (dropdown2 !== event.target && !dropdown2.has(event.target).length && trigger2 !== event.target) {
      $("#myIntolerance").hide();
    }
  });
});
