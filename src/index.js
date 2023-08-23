function displayTime() {
  let time = document.querySelector("#time");

  let now = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];

  let hour = now.getHours();
  let min = now.getMinutes();

  let period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  if (min < 10) {
    min = "0" + min;
  }
  let timeZone = now
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  time.innerHTML = `As of ${day} | ${hour}:${min} ${period} ${timeZone}`;
}
displayTime();

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "col";
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(function (day) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title" id="forecast-date"${day}</h5>
              <img src="http://openweathermap.org/img/wn/50d@2x.png" alt="Weather Icon" class="weather-icon">
              <p class="card-text"><span id="forecast-temp"85</span>°F</p>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "718acbad0e34daecdcbc4efb14a81ca0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function placeDisplay(event) {
  event.preventDefault();
  let cityState = document.querySelector("#current-city");
  let input = document.querySelector("#search");
  cityState.innerHTML = input.value;
}
let formSearch = document.querySelector("#citySearch");
formSearch.addEventListener("submit", placeDisplay);

function tempConvert(event) {
  event.preventDefault();
  let temp = document.querySelector("#main-temp");
  let degree = document.querySelector("#main-degree");

  if (degree.textContent === "°F") {
    let celsius = Math.round(((parseFloat(temp.textContent) - 32) * 5) / 9);
    temp.textContent = celsius;
    degree.textContent = "°C";
  } else {
    let fahrenheit = Math.round((parseFloat(temp.textContent) * 9) / 5 + 32);
    temp.textContent = fahrenheit;
    degree.textContent = "°F";
  }
}

let temp = document.querySelector("#main-temp");
temp.textContent = "71";
let degree = document.querySelector("#main-degree");
degree.textContent = "°F";

let degreeLink = document.querySelector("#main-degree");
degreeLink.addEventListener("click", tempConvert);

function searchCurrent(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "718acbad0e34daecdcbc4efb14a81ca0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayCurrent);
}

function displayCurrent(response) {
  let temperatureFahrenheit = Math.round(
    (parseFloat(response.data.main.temp) * 9) / 5 + 32
  );
  let temp = document.querySelector("#main-temp");
  temp.textContent = temperatureFahrenheit;
  let degree = document.querySelector("#main-degree");
  degree.textContent = "°F";
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  let description = document.querySelector("#weather");
  description.innerHTML = response.data.weather[0].description;
  let windspeed = document.querySelector("#wind");
  windspeed.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed * 2.23694
  )} mph`;
  let currentIcon = document.querySelector("#current-icon");
  let weatherIconCode = response.data.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
  currentIcon.setAttribute("src", iconUrl);
  currentIcon.setAttribute("alt", response.data.weather[0].description);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", function (event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrent);
});

function searchPosition(event) {
  event.preventDefault();

  let city = document.querySelector("#search").value;
  searchCity(city);
}
function searchCity(city) {
  let apiKey = "718acbad0e34daecdcbc4efb14a81ca0";
  let apiSearchUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiSearchUrl).then(displaySearchResults);
}

function displaySearchResults(response) {
  let temperatureFahrenheit = Math.round(response.data.list[0].main.temp);
  let temp = document.querySelector("#main-temp");
  temp.textContent = temperatureFahrenheit;
  let degree = document.querySelector("#main-degree");
  degree.textContent = "°F";
  let description = document.querySelector("#weather");
  description.innerHTML = response.data.list[0].weather[0].description;
  let city = document.querySelector("#current-city");
  city.innerHTML = response.data.city.name;
  let windspeed = document.querySelector("#wind");
  windspeed.innerHTML = `Wind: ${Math.round(
    response.data.list[0].wind.speed * 2.23694
  )} mph`;
  let currentIcon = document.querySelector("#current-icon");
  let weatherIconCode = response.data.list[0].weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
  currentIcon.setAttribute("src", iconUrl);
  currentIcon.setAttribute("alt", response.data.list[0].weather[0].description);
}

let searchForm = document.querySelector("#citySearch");
searchForm.addEventListener("submit", searchPosition);

searchCity("Boston, Massachusetts");
displayForecast();
