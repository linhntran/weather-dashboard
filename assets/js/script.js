var APIKey = "cab416ea3a1988df2a12b93ffef478e3";
var today = dayjs().format('MM/DD/YYYY');
var searchCityEl = $("#search-city");
var searchHistoryListEl = $('#search-history');
var searchButtonEl = $("#search-button");
var currentCityEl = $("#current-city");
var currentTempEl = $("#temp");
var currentWindEl = $("#wind");
var currentHumidityEl = $("#humidity");
var weatherContentEl = $("#weather-content");
var cityHistory = [];

listHistory();

searchButtonEl.on("click", function (event) {
    event.preventDefault();

    var searchValue = searchCityEl.val();
    searchCityEl.val("");

    currentRequest(searchValue);
    searchHistory(searchValue);
});

// Request current weather conditions
function currentRequest(searchValue) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIKey;

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response.status);
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            currentForecast(data);
        })

    // Displays data for current day
    function currentForecast(data) {
        console.log(data);
        currentCityEl.text(data.name);
        currentCityEl.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text(" (" + today + ") ");
        currentCityEl.append("<img src='https://openweathermap.org/img/w/" + data.weather[0].icon + ".png'/>")
        currentTempEl.text(data.main.temp);
        currentTempEl.append("&deg;F");
        currentWindEl.text(data.wind.speed + " MPH");
        currentHumidityEl.text(data.main.humidity + "%");

        var lat = data.coord.lat;
        var lon = data.coord.lon;

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

        fetch(forecastURL)
            .then(function (response) {
                if (response.ok) {
                    console.log(response.status);
                    return response.json();
                }
            })
            .then(function (data) {
                console.log(data);
                fiveDayForecast(data);
            })

        // Displays forecast for next five days
        function fiveDayForecast(data) {
            $('#weather-forecast').empty();
            for (i = 0; i < data.list.length; i += 8) {
                var forecastDateString = dayjs(data.list[i].dt_txt).format('MM/DD/YYYY');
                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day'>");
                var forecastCard = $("<div class='card'>");
                var forecastBody = $("<div class='card-body'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastWind = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");

                $('#weather-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastBody);

                forecastBody.append(forecastDate);
                forecastBody.append(forecastIcon);
                forecastBody.append(forecastTemp);
                forecastBody.append(forecastWind);
                forecastBody.append(forecastHumidity);

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                forecastDate.text(forecastDateString);
                forecastTemp.text(data.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastWind.text(data.list[i].wind.speed);
                forecastWind.prepend("Wind: ");
                forecastWind.append(" MPH");
                forecastHumidity.text(data.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");
            }
        }
    }
}

// Saves the search history of cities to an array
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
    searchHistoryListEl.empty();
    cityHistory.forEach(function (city) {
        var searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        searchHistoryListEl.prepend(searchHistoryItem);
    });
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    cityHistory = JSON.parse(localStorage.getItem("cities"));
}

// Shows history when page is refreshed
function listHistory() {
    if (localStorage.getItem("cities")) {
        cityHistory = JSON.parse(localStorage.getItem("cities"));
        listArray();
    }
}
