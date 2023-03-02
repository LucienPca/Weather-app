// Date related code starts here

setInterval(myTimer, 1000);

function myTimer() {
  let date = new Date();

  let weekday = date.toLocaleString(`en-GB`, { weekday: "long" });

  let dateString = date.toLocaleDateString(`en-GB`, { dateStyle: "long" });

  let time = date.toLocaleTimeString(
    `en-GB`,
    { timeStyle: "medium" },
    { hour: "2-digit" },
    { minute: "2-digit" },
    { hour12: false }
  );

  let displayedDay = document.querySelector("#week-day");
  displayedDay.innerHTML = `${weekday}`;

  let fullDate = document.querySelector("#full-date");
  fullDate.innerHTML = `${dateString}, ${time}`;
} // Date related ends starts here

//default load city data
function defaultCity(cityName) {
  let apiKey = "012116ce35bd8efe514166decfbdcb6c";
  let apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`; //This searches for the City name on openweather
  axios.get(`${apiCall}&appid=${apiKey}`).then(showTemperature);
}
//search form
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-field");
  let cityName = searchInput.value; //This grabs the data from the City input form
  defaultCity(cityName);
}

//This displays the current temperature pulled from the API
function showTemperature(response) {
  console.log(response.data.weather[0].icon);
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = `${temperature}`; // This shows the temperature
  let changeCity = document.querySelector("#displayed-city");
  changeCity.innerHTML = `${response.data.name} ・ ${response.data.sys.country}`; //This changes the City name and country initials
  let humidity = document.querySelector("#humid");
  humidity.innerHTML = `${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed) + " km/h";
  let pressure = document.querySelector("#press");
  pressure.innerHTML = `${response.data.main.pressure} hPa`;
  let condition = document.querySelector("#condition");
  let description = response.data.weather[0].description; //this is used for the weather condition display
  let capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);

  condition.innerHTML = `${capitalizedDescription}`; //capitalizes the first letter in the condition response

let icon = document.getElementById("weatherIcon");//this replaces the icon
icon.setAttribute("src", `images/${response.data.weather[0].icon}.png`);


}






//location button starts here

function getGpsLocation(position) {
  //function to get the geolocation
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "012116ce35bd8efe514166decfbdcb6c";
  let apiCallLoc = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiCallLoc).then(showTemperature);
}
function currentLocationButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getGpsLocation); //this returns the geoLocation function
}

let currentLocation = document.querySelector("#gpsLoc");
currentLocation.addEventListener("click", currentLocationButton);

let inputValue = document.querySelector("#search-form");
inputValue.addEventListener("submit", search); //this searches for the string input in the search bar

defaultCity("Rome, IT"); //default city to show on load

// Temperature - C vs F

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round((29 * 9) / 5 + 32);
}
function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = 29;
}

let fahrenheitSwitch = document.querySelector("#fahrenheit");
fahrenheitSwitch.addEventListener("click", convertToFahrenheit);

let celsiusSwitch = document.querySelector("#celsius");
celsiusSwitch.addEventListener("click", convertToCelsius);
