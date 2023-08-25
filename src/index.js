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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col" id="forecast">
            <div class="card text-center">
              <div class="card-body">
        ${formatDay(forecastDay.dt)}
        <img  src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
                  alt=""
                  width="45"
                />
                <div class="forecast-temp">
                  ${Math.round(
                    (forecastDay.temp.max + forecastDay.temp.min) / 2
                  )}°F </div>
                  </div>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ebef9ca4a8de66ed586fac628fade056";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

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

  getForecast(response.data.coord);
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
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displaySearchResults);
}

function displaySearchResults(response) {
  let temperatureFahrenheit = Math.round(response.data.main.temp);
  let temp = document.querySelector("#main-temp");
  temp.textContent = temperatureFahrenheit;
  let degree = document.querySelector("#main-degree");
  degree.textContent = "°F";
  let description = document.querySelector("#weather");
  description.innerHTML = response.data.weather[0].description;
  let city = document.querySelector("#current-city");
  city.innerHTML = response.data.name;
  let windspeed = document.querySelector("#wind");
  windspeed.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed * 2.23694
  )} mph`;
  let currentIcon = document.querySelector("#current-icon");
  let weatherIconCode = response.data.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
  currentIcon.setAttribute("src", iconUrl);
  currentIcon.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

let searchForm = document.querySelector("#citySearch");
searchForm.addEventListener("submit", searchPosition);

searchCity("Boston, Massachusetts");
