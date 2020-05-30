# Weather Dashboard

This application allows a user to check on the weather conditions of a city. The deployed application is: https://mairagee524.github.io/weather-dashboard/.

## Application Preview
The user first inputs a city in the search bar and clicks on the `submit` button. Then the weather data populates for the current day and the next five days. The user is also able to view the weather conditions of a city he/she/they looked up before by clicking on the city buttons below the search form. Should the user choose to clear the city search history buttons, the user can click the `clear` button at the bottom left of the page. 


## Functionality

#### API calls
When the user clicks the `submit` button, the city value makes a call to the weather API for different weather information. All information gathered from the call is then dynamically generated to the corresponding sections. 

- `current` - using AJAX to make a call to the weather API using a city name to get today's weather information.

- `five-day` - making a call to the weather API using a city name to get the weather conditions of the next 5 days after today. I used a for-loop to run through all the data and select the data with a specific timestamp. 

- `uv index` - making a call to the weather API using the coordinates of the city to then give a number between 0 and 15. The coordinates are grabbed from the AJAX call from the current day function. 

#### Weather information on Browser
Every weather data on the browswer is dynamically grabbed by transversing the DOM from the AJAX response. It is then selected using jQUery and printed to the browser usng `.text()`

#### City Buttons
Every time a user types a city and clicks on the `submit` button, a button with the city name is dynamically generated and placed under the search form. The city button itself is functional - when the user clicks on it, the weather dashboard is updated with the weather conditions for that city. 

## Credit
Some of the code on my application was inspired by a fellow Github user found in https://github.com/cynthiarich/weather-dashboard. Thank you so much! :)