// List of saved cities from search form
var citiesSavedArray = [];

// API Key from OpenWeatherMap
var APIKey = "b0a19a0be2f3b5be2ea0ae0f9dbf7b8c";

// Current Date
var currentDate = moment().format('dddd, MMMM Do, YYYY');

// Function to have data stay in the browser
function initialize() {
    
    // Keep last city info on browser
    cityToBrowser = localStorage.getItem(localStorage.length);
  
    // If-statement for if city is inputted or not
    if (cityToBrowser < 1) {
        return;

    } else {
        ajaxCallToCurrentWeather(cityToBrowser);
        ajaxCallToFiveDayFutureWeather(cityToBrowser);
    }

    // For-loop to push local storage items to array if there are cities on refresh
    for (var i = 1; i <= localStorage.length; i++) {
        var temp = localStorage.getItem(i);
        citiesSavedArray.push(temp);
    }

    // Generate function to create buttons
    generateCityButtonsOnRefresh();
};

initialize();

// Clicking on `submit` button 
$('#submit').on("click", function(event) {
    event.preventDefault();

    // Get value of the city name from the submit button
    var city = $('#city-name')[0].value;

    // If-statement for data validation: if no city is entered
    if (city.length < 1) {
        alert("Please enter a city.");
        return;
    }

    // If-statement for data validation: if city entered has invalid characters
    if (!city.match(/^[A-Za-z ]+$/)) {
        alert("Please check your spelling.");
        return;
    }

    // Clear contents in input form
    $('#search-city')[0].reset();

    // Generate following functions
    generateCityHistoryButtons(city);
    ajaxCallToCurrentWeather(city);
    ajaxCallToFiveDayFutureWeather(city);
});

// Generate buttons from array on refresh
function generateCityButtonsOnRefresh() {
 
    // For-loop to generate city buttons from array
    for (var i = 0; i < citiesSavedArray.length; i++) {
        var oneCity = $('<button>');
        oneCity.attr("id", citiesSavedArray[i]);
        oneCity.attr("class", "saved-city");
        oneCity.text(citiesSavedArray[i]);
        
        // Append buttons to section
        $('#city-history-search').append(oneCity);
    }
}

// Function to generate city history buttons on click handler
function generateCityHistoryButtons(city) {
    city = city.toUpperCase();

    // If-statement to alert user to input another city if that same city has been inputted before
    if (citiesSavedArray.indexOf(city) > -1) {
        alert("Please enter another city.");
        return;
    }

    // Push city to array
    citiesSavedArray.push(city);

    // Set the city input into local storage
    localStorage.setItem(citiesSavedArray.length, city);

    // Generate city buttons
    var oneCity = $('<button>');
    oneCity.attr("id", city);
    oneCity.attr("class", "saved-city");
    oneCity.text(city);
    
    // Append buttons to section
    $('#city-history-search').append(oneCity);
};

// Function to make AJAX call to today's weather
function ajaxCallToCurrentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    console.log(queryURL);

    // Run  AJAX call to the OpenWeatherMap API for today's weather
    $.ajax ({
        url: queryURL,
        method: "GET",

        // Error function runs if user unput does not match OWM server on list of cities
        error: function () {
            alert("Please try again.");
            $('#search-city')[0].reset();

            // Remove last button created
            $('#city-history-search').children().last().remove();

            // Remove last element from array
            citiesSavedArray.pop();

            // Remove last key/vaue pair from local storage
            localStorage.removeItem(localStorage.length);
            return;
        }
    })
    
    // If user inputs a city that is valid...
    .then(function(response) {
        console.log(response);

        // Give style to box that will hold basic city info
        $('#city-basic-info').attr("id", "info-box");

        // Print city name text to browser
        $('#city').text(response.name);

        // Pring image to browser by manipulating DOM to find icon and adding to url
        var currentImg = $("<img>");
        currentImg.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
        $('#city').prepend(currentImg);

        // Print date
        $('#current-date').text(currentDate);

        //Convert from Kelvin to Fahrenheit temp
        var fahrenheitTemp = (response.main.temp - 273.15) * 1.80 + 32;

        // Print date
        $('#current-temp').text("Temperature: " + +fahrenheitTemp.toFixed(1) + " °F");

        // Print humidity percentage
        $('#current-humid').text("Humidity: " + response.main.humidity + "%");

        // Print wind speed
        $('#current-wind-speed').text("Wind Speed: " + response.wind.speed + " m/s");

        // Declare var for lat/long coordinates to find UV index
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;

        // Start function to get the UV index
        getCurrentWeatherUVIndex(latitude, longitude);
    });
};

// Function to generate the UV index of a city by using coordinates and doing different AJAX call
function getCurrentWeatherUVIndex(latitude, longitude) {
    var queryURLIndex = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
    console.log(queryURLIndex);

    $.ajax({
        url: queryURLIndex,
        method: "GET"
    })

    .then(function(response){
        console.log(response);

        // Declare variables for value from AJAX call and background color
        var uVIndex = response.value;
        var backgroundColor;

        // If-else statements for determining color based on UV index
        if (uVIndex <= 2.99) {
            backgroundColor = "green";
        } else if (uVIndex >= 3 && uVIndex <= 5.99) {
            backgroundColor = "yellow";
        } else if (uVIndex >= 6 && uVIndex <= 8.99) {
            backgroundColor = "orange";
        } else {
            backgroundColor = "red";
        }

        // Making container for the UV index color
        var uvContainer = $("<p>").attr("class", "card-text").text("UV Index: ");

        // Append <spa> to container to add style based on what the UV index is
        uvContainer.append($("<span>").attr("class", "index").attr("style", ("background-color:" + backgroundColor)).text(uVIndex));

        // Append container to section
        $('#current-wind-speed').append(uvContainer);
    })
}

// Function to make AJAX call to the next 5 days for weather
function ajaxCallToFiveDayFutureWeather (city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    console.log(queryURL);

    // Run AJAX call to the OpenWeatherMap API to get weather info on the weather conditions for the next 5 days
    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function(response){
        console.log(response);

        // Generate function to print 5-day weather info to browser
        generateFiveDaysForecast(response);
    })
}

// Function to generate container to hold information of the weather conditions for the next 5 days
function generateFiveDaysForecast(response) {

    // Empty preceding 5-day row for every valid city inputted
    $('#future-forecast').empty();

    // For-loop to generate 5-day weather information
    for (var i = 0; i < response.list.length; i++) {

        // If-statement to target .indexOf('12:00:00')
        if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {

            // New div with class
            var oneDay = $("<div>");
            oneDay.attr("class", "forecast");
    
            // New div with style and date text added
            var forecastDate = $("<div>");
            forecastDate.text(moment(response.list[i].dt, "X").format('ddd, M/D/YY'));
            forecastDate.attr('class', 'forecast-date');
    
            // New img printed to browser by manipulating DOM to find icon and adding to url
            var forecastImg = $("<img>");
            forecastImg.attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
            forecastImg.attr('class', 'forecast-img');
    
            // Formula to convert temperature from Kelvin to Fahrenheit
            var forecastFahrenheit = (response.list[i].main.temp - 273.15) * 1.80 + 32;

            // New p-tag to print temperature
            var forecastTemp = ($("<p>"));
            forecastTemp.text("Temp: " + +forecastFahrenheit.toFixed(1) + " °F");

            // New p-tag to print humidity
            var forecastHumid = ($("<p>"));
            forecastHumid.text("Humidity: " + response.list[i].main.humidity + "%")

            // Append all printed information to section
            oneDay.append(forecastDate);
            oneDay.append(forecastImg);
            oneDay.append(forecastTemp);
            oneDay.append(forecastHumid);

            // Append day container to section
            $('#future-forecast').append(oneDay);
        }
    }
};

// When clicking on city buttons...
$('#city-history-search').on("click", '.saved-city', function () {
    event.preventDefault();

    // Declare new variable with text from button
    savedCity = $(this).text();

    // Run following functions with new variable
    ajaxCallToCurrentWeather(savedCity);
    ajaxCallToFiveDayFutureWeather(savedCity);
});

// Clear city buttons on click
$('#clear-search-history').on("click", function () {
    event.preventDefault();

    // Clear Local Storage
    window.localStorage.clear();

    // Remove ALL city buttons and weather contents
    $('#city-history-search').children().remove();
    $('#top-container').children().remove();
    $('#future-forecast').children().remove();

    // Remove all elements from array
    citiesSavedArray.splice(0, citiesSavedArray.length);
});