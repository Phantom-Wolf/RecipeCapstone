
const apiKey = "21b612134db24ae285c7a2db190c41fc";
let searchTermString = "italian";

function newDataAPI() {

    let searchTerm = $('#recipe').val();
    let maxResults = $('#max-results').val();
    console.log(`search term: ${searchTerm}`)
    console.log(`max results: ${maxResults}`)
  fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=${maxResults}&apiKey=21b612134db24ae285c7a2db190c41fc`
  )
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
      .then(responseJson => console.log(responseJson))
      .catch(error => console.log(error));
  }
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    $(".list").empty();
    $(".err-js").empty();
    $("#results").hide();
    $(".sorry").remove();
    newDataAPI();
  });
}

$(function() {
  console.log("App loaded! Waiting for submit!");
  $("#results").hide();
  watchForm();
});
// $(newDataAPI(searchTermString));
