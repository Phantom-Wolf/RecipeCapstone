const apiKey = "21b612134db24ae285c7a2db190c41fc";
let searchURL = "https://api.spoonacular.com/recipes/complexSearch";

// makes use of, and formats, the api request returns for html doc

function displayResults(responseJson) {
  console.log(responseJson);
  $(".list").append(`
  
  <li id="${responseJson.id}">
    <h2>${responseJson.title}</h2>
    <div class="short-recipe-container">
        <img src="${responseJson.image}" alt="${responseJson.title}" class="recipe-image-short">
      <section class="prelimInfo">
        <p>Serving Size: ${responseJson.servings}</p>
        <p>Made ready in ${responseJson.readyInMinutes} minutes!</p>
      </section>
    </div>
    <div class="recipeBody">
      <section>
        <h3>Ingredients</h3>
        <ul class="ingredientsList">
        </ul>
      </section>
      <section class="recipeInstructions">
        
      </section>
    </div>
  </li>
  `);


  let ingredients = responseJson.extendedIngredients;
  for (let i = 0; i < ingredients.length; i++) {
    $(`#${responseJson.id} .ingredientsList`).append(`
    <li>
      -${ingredients[i].original}
    </li>
    `);
  }
  let wine = responseJson.winePairing;
  
  if (wine.pairedWines && wine.pairedWines.length > 0) {
    $(`#${responseJson.id} .prelimInfo`).append(`
    <p><span>Wine Pairing:</span> ${wine.pairingText}</p>
    `);
  }

  if (responseJson.instructions !== null) {
    $(`#${responseJson.id} .recipeInstructions`).append(`
      <h3>Instructions</h3>
      <p>${responseJson.instructions}</p>
    `);
  } else {
    $(`#${responseJson.id} .recipeInstructions`).append(`
    <h3>Instructions</h3>
    <p>No instructions needed, just mix together!</p>
  `);
  }
  
  $('#recipe-search').val("");

  $('.results-js').removeClass("hidden");
}

//  the following 3 functions builds the url, fetches initial request for recipes, takes
//  that data and fetches another request for full details.

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function getRecipes() {
  let searchTerm = $("#recipe-search").val();

  let exclusions = [];
  $('.dropdown-contentA input[type="checkbox"]:checked').each(function() {
    exclusions.push($(this).val());
  });
  let exclude = exclusions.join(",");

  let allergy = [];
  $('.dropdown-contentB input[type="checkbox"]:checked').each(function() {
    allergy.push($(this).val());
  });
  let allergies = allergy.join(",");

  const params = {
    apiKey: apiKey,
    query: searchTerm,
    number: 6,
    intolerances: allergies,
    excludeIngredients: exclude,
    maxReadyTime: 30
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(resonse.statusText);
    })
    .then(responseJson => getDetails(responseJson))
    .catch(error => {
      $("#err-js").text(`Something went wrong: ${error.message}`);
      console.log(error);
    });
}

function getDetails(responseJson) {
  console.log(responseJson);

  if (responseJson.results.length < 1) {
    $(".list").append(`
    <li>
    <p>Sorry! We did not find any matching results.</p>
    </li>
    `);
    $('.results-js').removeClass("hidden");
  } else {
    for (let i = 0; i < responseJson.results.length; i++) {
      fetch(
        `https://api.spoonacular.com/recipes/${responseJson.results[i].id}/information?includeNutrition=false&apiKey=21b612134db24ae285c7a2db190c41fc`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(resonse.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
          $("#err-js").text(`Something went wrong: ${error.message}`);
          console.log(error);
        });
    }
  }
}

//  populates the drop down menus for exclusion and allergies

function populateDropdowns() {
  let exclude = STORE.exclusions;
  for (let i = 0; i < exclude.length; i++) {
    $("#myExclude").append(`
    <label class="drop-items ${exclude[i]}" >
      <input type="checkbox"  name="${exclude[i]}" tabindex="4" value="${exclude[i]}">
      <span class="checkmark"></span>${exclude[i]}
    </label>
    `);
  }

  let allergy = STORE.allergies;
  for (let i = 0; i < allergy.length; i++) {
    $("#myAllergy").append(`
    <label class="drop-items ${allergy[i]}" >
      <input type="checkbox" name="exclusion" tabindex="7" value="${allergy[i]}">
      <span class="checkmark"></span>
      ${allergy[i]}
    </label>
    `);
  }

  $(".Other").html;
}

//  the start of the webapp, waiting for a submission

function watchForm() {
  $('.results-js').addClass("hidden");
  $(".main-search").submit(event => {
    event.preventDefault();
    $(".list").html("");
    $(".err-js").empty();
    $('.results-js').addClass("hidden");
    $(".sorry").remove();
    $('header').css("height","auto")
    $('.title').css("margin","5px auto")
    
    getRecipes();
  });
}

$(function() {
  populateDropdowns();
  $("#search-recipe").focus();
  watchForm();
});

// creates the toggle effect for dropdown menus with document click hide()

$(function toggleDropdown() {
  $("#exclusion-button").click(function() {
    $("#myExclude").toggle();
  });

  $("#allergy-button").click(function() {
    $("#myAllergy").toggle();
  });

  $(document).on("click", function(event) {
    let trigger = $("#exclusion-button")[0];
    let dropdown = $("#myExclude");
    if (
      dropdown !== event.target &&
      !dropdown.has(event.target).length &&
      trigger !== event.target
    ) {
      $("#myExclude").hide();
    }
    let trigger2 = $("#allergy-button")[0];
    let dropdown2 = $("#myAllergy");
    if (
      dropdown2 !== event.target &&
      !dropdown2.has(event.target).length &&
      trigger2 !== event.target
    ) {
      $("#myAllergy").hide();
    }
  });
});





