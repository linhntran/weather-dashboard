var APIKey = "cab416ea3a1988df2a12b93ffef478e3";
var today = dayjs().format('MM/DD/YYYY');

var searchCityInput = $("#search-city");
var searchHistoryList = $('#search-history-list');
var searchButton = $("#search-button");
var currentCityTitle = $("#current-city");
var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");
var weatherContent = $("#weather-content");

var cityHistory = [];

listHistory();

searchButton.on("click", function (event) {
    event.preventDefault();

    var searchValue = searchCityInput.val();

    currentRequest(searchValue);
    searchHistory(searchValue);
    searchCityInput.val("");
});

// Request Open Weather API based on user input


// Displays and saves the search history of cities to array
function searchHistory(searchValue) {
    if (searchValue) {
        if (cityHistory.indexOf(searchValue) === -1) {
            cityHistory.push(searchValue);
            listArray();
        } 
    }
}

// Lists array of search history 
function listArray() {
    searchHistoryList.empty();
    cityHistory.forEach(function (city) {
        var searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        searchHistoryList.prepend(searchHistoryItem);
    });
    localStorage.setItem("cities", JSON.stringify(cityHistory));
}

// Pulls history from local storage
function listHistory() {
    if (localStorage.getItem("cities")) {
        cityHistory = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityHistory.length - 1;
        listArray();
    }
}