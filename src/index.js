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

  if (degree.textContent === "°C") {
    let fahrenheit = Math.round((parseFloat(temp.textContent) * 9) / 5 + 32);
    temp.textContent = fahrenheit;
    degree.innerHTML = "<a href='#'>°F</a>";
    degree.firstChild.style.textDecoration = "none";
  } else {
    let celsius = Math.round(((parseFloat(temp.textContent) - 32) * 5) / 9);
    temp.textContent = celsius;
    degree.innerHTML = "<a href='#'>°C</a>";
    degree.firstChild.style.textDecoration = "none";
  }
}

let degree = document.querySelector("#main-degree");
degree.addEventListener("click", tempConvert);

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
  let temperature = Math.round(response.data.main.temp);
  let temp = document.querySelector("#main-temp");
  temp.innerHTML = temperature;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  let description = document.querySelector("#weather");
  description.innerHTML = response.data.weather[0].description;
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
  let temperature = Math.round(response.data.list[0].main.temp);
  let temp = document.querySelector("#main-temp");
  temp.innerHTML = temperature;
  let description = document.querySelector("#weather");
  description.innerHTML = response.data.list[0].weather[0].description;
  let city = document.querySelector("#current-city");
  city.innerHTML = response.data.city.name;
}

let searchForm = document.querySelector("#citySearch");
searchForm.addEventListener("submit", searchPosition);

searchCity("Boston, Massachusetts");
