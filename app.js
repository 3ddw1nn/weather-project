const form = document.querySelector(".form");
const search = document.getElementById("search");
const defaultTemperature = document.querySelector(".default-temperature");
const weatherDisplay = document.querySelector(".weather-info");

const cityDiv = document.querySelector(".city-location");
const countryDiv = document.querySelector(".country-location");

const tempToggle = document.querySelector(".temperature-toggle");
const flDefaultTemperature = document.querySelector(".flDefault-temperature");
const dateDiv= document.querySelector(".date")

const sunriseDiv = document.querySelector(".sunrise");
const sunsetDiv = document.querySelector(".sunset");
const cloudsDiv = document.querySelector(".clouds");
const weatherDiv = document.querySelector(".weather");
const weatherDescDiv = document.querySelector(".weather-description");
const windSpeedDiv = document.querySelector(".wind-speed");
const windDegreeDiv = document.querySelector(".wind-degree");
const dailyDiv = document.querySelector(".daily");

const dayOneDiv = document.querySelector(".day1");
const dayTwoDiv = document.querySelector(".day2");
const dayThreeDiv = document.querySelector(".day3");
const dayFourDiv = document.querySelector(".day4");
const dayFiveDiv = document.querySelector(".day5");

const dayOneTitle = document.querySelector(".day1-title");
const dayTwoTitle = document.querySelector(".day2-title");
const dayThreeTitle = document.querySelector(".day3-title");
const dayFourTitle = document.querySelector(".day4-title");
const dayFiveTitle = document.querySelector(".day5-title");

let convertBool = true;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  displayData();
});

async function searchWeather() {
  let searchValue = search.value;
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&APPID=18acb744716d912799998488e3980230`,
    { mode: "cors" }
  );
  if (!response.ok) {
    throw new Error("Did not work");
  }
  const weatherData = await response.json();
  console.log(weatherData);
  return weatherData;
}

async function dailyForecast() {
  const fetchCityData = await searchWeather();
  let cityLat = fetchCityData.coord.lat;
  let cityLon = fetchCityData.coord.lon;

  const forecastResponse = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=18acb744716d912799998488e3980230`,
    { mode: "cors" }
  );

  if (!forecastResponse.ok) {
    throw new Error("Forecast did not work");
  }
  const forecastData = await forecastResponse.json();
  console.log(forecastData);
  return forecastData;
}

async function displayData() {
  const cityWeather = await searchWeather();

  dateDiv.textContent= new Date();

  const date = new Date();
  console.log(date);

  const cityLocation = cityWeather.name;
  const countryLocation = cityWeather.sys.country;

  const sunrise = cityWeather.sys.sunrise;
  const sunset = cityWeather.sys.sunset;
  const weatherDesc = cityWeather.weather[0].description;
  const windSpeed = cityWeather.wind.speed;
  const timeZone = cityWeather.timezone;

  let sunriseConv = new Date((sunrise + timeZone) * 1000);
  let sunsetConv = new Date((sunset + timeZone) * 1000);

  let newSunriseHour = sunriseConv.getUTCHours();
  let newSunriseMinutes = sunriseConv.getUTCMinutes();

  let newSunsetHour = sunsetConv.getUTCHours() % 12 || 12;
  let newSunsetMinutes = sunsetConv.getUTCMinutes();
  let newSunsetMinutesFix = "";
  let newSunriseMinutesFix = "";

  let newWindSpeed = windSpeed * 3.6;

  if (newSunsetMinutes < 10) {
    newSunsetMinutesFix = "0" + newSunsetMinutes;
  } else {
    newSunsetMinutesFix = newSunsetMinutes;
  }

  if (newSunriseMinutes < 10) {
    newSunriseMinutesFix = "0" + newSunriseMinutes;
  } else {
    newSunriseMinutesFix = newSunriseMinutes;
  }

  weatherDisplay.style.visibility = "visible";

  cityDiv.textContent = cityLocation;
  countryDiv.textContent = countryLocation;

  sunriseDiv.textContent = newSunriseHour + ":" + newSunriseMinutesFix + " AM";
  sunsetDiv.textContent = newSunsetHour + ":" + newSunsetMinutesFix + " PM";
  weatherDescDiv.textContent = weatherDesc.toUpperCase();
  windSpeedDiv.textContent = newWindSpeed.toFixed(1) + " km/h";

  dayOneTitle.textContent = date.getDate(date.setDate(date.getDate() + 1));
  dayTwoTitle.textContent = date.getDate(date.setDate(date.getDate() + 1));
  dayThreeTitle.textContent = date.getDate(date.setDate(date.getDate() + 1));
  dayFourTitle.textContent = date.getDate(date.setDate(date.getDate() + 1));
  dayFiveTitle.textContent = date.getDate(date.setDate(date.getDate() + 1));

  convertTemperature();
}

tempToggle.addEventListener("click", convertTemperature);

async function convertTemperature() {
  const getTemp = await searchWeather();
  const forecastWeather = await dailyForecast();

  const cityTemp = getTemp.main.temp;
  const feelsLike = getTemp.main.feels_like;
  const dayOneTemp = forecastWeather.list[0].main.temp;
  const dayTwoTemp = forecastWeather.list[1].main.temp;
  const dayThreeTemp = forecastWeather.list[2].main.temp;
  const dayFourTemp = forecastWeather.list[3].main.temp;
  const dayFiveTemp = forecastWeather.list[4].main.temp;

  if (convertBool) {
    let cTemp = (cityTemp - 273.15).toFixed(1);
    let flcTemp = (feelsLike - 273.15).toFixed(1);
    let dayOnecTemp = (dayOneTemp - 273.15).toFixed(1);
    let dayTwocTemp = (dayTwoTemp - 273.15).toFixed(1);
    let dayThreecTemp = (dayThreeTemp - 273.15).toFixed(1);
    let dayFourcTemp = (dayFourTemp - 273.15).toFixed(1);
    let dayFivecTemp = (dayFiveTemp - 273.15).toFixed(1);
    let celsius = cTemp + " ℃";
    let flCelsius = flcTemp + " ℃";
    defaultTemperature.textContent = celsius;
    defaultTemperature.style.color = "white";
    flDefaultTemperature.textContent = flCelsius;
    flDefaultTemperature.style.color = "white";
    dayOneDiv.textContent = dayOnecTemp + " ℃";
    dayTwoDiv.textContent = dayTwocTemp + " ℃";
    dayThreeDiv.textContent = dayThreecTemp + " ℃";
    dayFourDiv.textContent = dayFourcTemp + " ℃";
    dayFiveDiv.textContent = dayFivecTemp + " ℃";
    convertBool = false;
  } else {
    let fTemp = ((cityTemp - 273.15) * 1.8 + 32).toFixed(1);
    let flfTemp = ((feelsLike - 273.15) * 1.8 + 32).toFixed(1);
    let dayOnefTemp = ((dayOneTemp - 273.15) * 1.8 + 32).toFixed(1);
    let dayTwofTemp = ((dayTwoTemp - 273.15) * 1.8 + 32).toFixed(1);
    let dayThreefTemp = ((dayThreeTemp - 273.15) * 1.8 + 32).toFixed(1);
    let dayFourfTemp = ((dayFourTemp - 273.15) * 1.8 + 32).toFixed(1);
    let dayFivefTemp = ((dayFiveTemp - 273.15) * 1.8 + 32).toFixed(1);
    let farenheit = fTemp + " ℉";
    let flFarenheit = flfTemp + " ℉";
    defaultTemperature.textContent = farenheit;
    defaultTemperature.style.color = "white";
    flDefaultTemperature.textContent = flFarenheit;
    flDefaultTemperature.style.color = "white";
    dayOneDiv.textContent = dayOnefTemp + " ℉";
    dayTwoDiv.textContent = dayTwofTemp + " ℉";
    dayThreeDiv.textContent = dayThreefTemp + " ℉";
    dayFourDiv.textContent = dayFourfTemp + " ℉";
    dayFiveDiv.textContent = dayFivefTemp + " ℉";
    convertBool = true;
  }
}
