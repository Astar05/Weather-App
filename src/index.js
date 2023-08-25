let videoContainer = document.getElementById("videoContainer");
let timeElement = document.querySelector("#time");

let videoUrls = [
  "video/cloudy-sun.mp4",
  "video/clouds-afternoon.mp4",
  "video/clouds-evening.mp4",
];

function getCurrentVideoIndex() {
  let now = new Date();
  let hours = now.getHours(); // Get local hours

  if (hours >= 7 && hours < 12) {
    return 0; // 7 am - 11:59 am
  } else if (hours >= 12 && hours < 17) {
    return 1; // 12 pm - 4:59 pm
  } else {
    return 2; // 5 pm - 6:59 am
  }
}

function updateVideo() {
  let index = getCurrentVideoIndex();
  videoContainer.src = videoUrls[index];
  videoContainer.load();
  videoContainer.play();
}

function displayTime() {
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

  timeElement.innerHTML = `As of ${day} | ${hour}:${min} ${period} ${timeZone}`;
}

updateVideo();
displayTime();

let interval = setInterval(() => {
  updateVideo();
  displayTime();
}, 60000);

let forecastTempsFahrenheit = [];

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecastTempsFahrenheit = [];

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let fahrenheitTemp = Math.round(
        (forecastDay.temp.max + forecastDay.temp.min) / 2
      );
      forecastTempsFahrenheit.push(fahrenheitTemp);

      forecastHTML += `<div class="col">
            <div class="card text-center">
              <div class="card-body">
                ${formatDay(forecastDay.dt)}
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                  alt=""
                  width="45"
                />
                <div class="forecast-temp">
                  ${fahrenheitTemp}<span id="forecast-degree">°F</span></div>
              </div>
            </div>
          </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
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

    forecastTempsFahrenheit.forEach(function (fahrenheitTemp, index) {
      let forecastTempElement =
        document.querySelectorAll(".forecast-temp")[index];
      let celsiusForecast = Math.round(((fahrenheitTemp - 32) * 5) / 9);
      forecastTempElement.textContent = `${celsiusForecast}°C`;
    });
  } else {
    let fahrenheit = Math.round((parseFloat(temp.textContent) * 9) / 5 + 32);
    temp.textContent = fahrenheit;
    degree.textContent = "°F";

    forecastTempsFahrenheit.forEach(function (fahrenheitTemp, index) {
      let forecastTempElement =
        document.querySelectorAll(".forecast-temp")[index];
      forecastTempElement.textContent = `${fahrenheitTemp}°F`;
    });
  }
}

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
