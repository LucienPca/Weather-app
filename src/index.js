// Date related code starts here
let displayedDay = document.querySelector("#week-day");
let fullDate = document.querySelector("#full-date");

function myTimer() {
  const date = new Date();

  const weekday = date.toLocaleString(`en-GB`, { weekday: "long" });
  const dateString = date.toLocaleDateString(`en-GB`, { dateStyle: "long" });

  let time = date.toLocaleTimeString(`en-GB`, {
    hour12: false,
    timeStyle: "medium",
  });

  displayedDay.innerHTML = `${weekday}`;

  fullDate.innerHTML = `${dateString}, ${time}`;

  // Schedule the next update
  window.requestAnimationFrame(myTimer);
}
// Start the animation loop
window.requestAnimationFrame(myTimer);

// Date related ends starts here

//default load city data & API call
function defaultCity(cityName) {
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`; //This searches for the City name on openweather
  axios.get(`${apiCall}`).then(showTemperature);
}

//search form
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-field");
  let cityName = searchInput.value; //This grabs the data from the City input form
  defaultCity(cityName);
}

///function that picks the coordinates from the returned API call, used for the daily forecast
function getForecast(coordinates) {
  const apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//Forecast HTML inject starts here
function displayForecast(response) {
  //This uses loop to iterate over the elements that need to update with the temperature data.

  let cachedResponse; //creates a cache for the loop API calls

  function makeApiCall() {
    // Make API call and store response in cachedResponse variable
    cachedResponse = response.data.daily;
  }

  // Call makeApiCall function once to get initial data
  makeApiCall();

  // Loop through cachedResponse variable instead of making new API calls
  for (let t = 1; t <= 6; t++) {
    const dayTemp = document.querySelector(`#day${t}Temp`);
    dayTemp.innerHTML = `${Math.round(cachedResponse[t - 1].temp.day)}??C`;

    const fahrenheitSwitch = document.querySelector("#fahrenheit");
    fahrenheitSwitch.addEventListener("click", (event) =>
      convertToFahrenheit(event, t, response)
    );

    const celsiusSwitch = document.querySelector("#celsius");
    celsiusSwitch.addEventListener("click", (event) =>
      convertToCelsius(event, t, response)
    );
  }
  //Conversion functions
  function convertToFahrenheit(event, t, response) {
    event.preventDefault();
    const fahrenheitTemp =
      (Math.round(cachedResponse[t - 1].temp.day) * 9) / 5 + 32;
    const temperatureElement = document.querySelector(`#day${t}Temp`);
    temperatureElement.innerHTML = `${Math.round(fahrenheitTemp)}??F`;
  }

  function convertToCelsius(event, t, response) {
    event.preventDefault();
    const celsiusTemp = Math.round(cachedResponse[t - 1].temp.day);
    const temperatureElement = document.querySelector(`#day${t}Temp`);
    temperatureElement.innerHTML = `${celsiusTemp}??C`;
  }

  //A loop that changes the forecast icons
  for (let i = 1; i <= 6; i++) {
    const dayIcon = document.querySelector(`#day${i}Icon`);
    dayIcon.setAttribute(
      "src",
      `images/${cachedResponse[i - 1].weather[0].icon}.png`
    );
  }

  //date name starts here
  for (let d = 1; d <= 6; d++) {
    const unixTimestamp = cachedResponse[d].dt;
    const date = new Date(unixTimestamp * 1000);
    const weekday = date.getDay();
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayName = weekdayNames[weekday];

    const dayName = document.querySelector(`#day${d}Name`);
    dayName.innerHTML = weekdayName;
  }
}

//This displays the current temperature pulled from the API
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = `${temperature}`; // This shows the temperature
  let changeCity = document.querySelector("#displayed-city");
  changeCity.innerHTML = `${response.data.name} ??? ${response.data.sys.country}`; //This changes the City name and country initials
  let humidity = document.querySelector("#humid");
  humidity.innerHTML = `${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed) + " m/s";
  let pressure = document.querySelector("#press");
  pressure.innerHTML = `${response.data.main.pressure} hPa`;
  let condition = document.querySelector("#condition");
  let description = response.data.weather[0].description; //this is used for the weather condition display
  let capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);

  condition.innerHTML = `${capitalizedDescription}`; //capitalizes the first letter in the condition response

  let icon = document.getElementById("weatherIcon"); //this replaces the icon
  icon.setAttribute("src", `images/${response.data.weather[0].icon}.png`);

  celsiusTemp = Math.round(response.data.main.temp); //defines the global variable celsiusTemp

  getForecast(response.data.coord); //function that picks the coordinatesfrom the returned API call

  //searches for images on unsplash and displays them according to the search value
  const apiKeyimg = "JiQFagWv_fovw1fnzjHmgaYm1oIbUDalSwb8FMp5KNs";
  const apiUrlimg = `https://api.unsplash.com/search/photos?query=${changeCity.innerHTML}&orientation=portrait&client_id=${apiKeyimg}`;
  axios
    .get(apiUrlimg)
    .then((response) => {
      const results = response.data.results;
      const randomIndex = Math.floor(Math.random() * results.length);
      const imageUrl = results[randomIndex].urls.regular; //creates random array numbers to randomise the image output

      const leftBox = document.querySelector(".left-box");
      leftBox.style.backgroundImage = `linear-gradient(
 321deg,
 rgba(71, 15, 255, 0.5) 0%,
 rgba(104, 173, 255, 0.7) 44%,
 rgba(173, 241, 255, 1) 100%
),
url("${imageUrl}")`;
      //adds image credits
      let unsplashCredits = document.querySelector("#unsplash-credits");
      unsplashCredits.innerHTML = `Photo by ${response.data.results[randomIndex].user.first_name} ${response.data.results[randomIndex].user.last_name} on`;
      const unsplashLink = document.querySelector(".unsplash-link");
      const linkData = response.data.results[randomIndex].links.html;
      unsplashLink.setAttribute(`href`, linkData);
    })
    .catch((error) => console.log(error));
}

//location button starts here

function getGpsLocation(position) {
  //function to get the geolocation
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
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
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}
function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = celsiusTemp;
}

let celsiusTemp = null; //Global variable that's not contained in any functions, used to define the C temperature
let fahrenheitSwitch = document.querySelector("#fahrenheit");
fahrenheitSwitch.addEventListener("click", convertToFahrenheit);

let celsiusSwitch = document.querySelector("#celsius");
celsiusSwitch.addEventListener("click", convertToCelsius);

// Change C/F link colours starts here

const celsiusLink = document.querySelector("#celsius");
const fahrenheitLink = document.querySelector("#fahrenheit");

celsiusLink.addEventListener("click", function () {
  celsiusLink.style.color = "white";
  fahrenheitLink.style.color = "#cdfeff";
  celsiusLink.style.cursor = "default";
  fahrenheitLink.style.cursor = "pointer";
});

fahrenheitLink.addEventListener("click", function () {
  fahrenheitLink.style.color = "white";
  celsiusLink.style.color = "#cdfeff";
  fahrenheitLink.style.cursor = "default";
  celsiusLink.style.cursor = "pointer";
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
