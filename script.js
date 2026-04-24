/*Weather Forecast Application Api*/

const API_KEY = "9f6e7f62b5aaa0864c821c4fb54536b3";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

let currentUnit = 'C';
let currentTempKelvin = null;
let recentCities = JSON.parse(localStorage.getItem('weather_recent') || '[]');

// kelvin calculation...
const K2C = k => (k - 273.15).toFixed(1);
const K2F = k => ((k - 273.15) * 9 / 5 + 32).toFixed(1);
const convertTemp = k => currentUnit === 'C' ? K2C(k) : K2F(k);

//search
function searchByCity() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) return alert("Enter city");
  fetchWeather(city);
}

//Fetch Weather
async function fetchWeather(city) {
  try {
    const res = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}`);
    const data = await res.json();

    if (data.cod === "404") {
      alert("City not found");
      return;
    }

    renderWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
    saveCity(data.name);

  } catch {
    alert("Error fetching data");
  }
}

function renderWeather(data) {
  currentTempKelvin = data.main.temp;

  document.getElementById("current-weather").classList.remove("hidden");

  document.getElementById("cw-city").innerText = data.name;
  document.getElementById("cw-desc").innerText = data.weather[0].description;
  document.getElementById("cw-temp").innerText = convertTemp(data.main.temp) + "°" + currentUnit;
  document.getElementById("cw-humidity").innerText = "Humidity: " + data.main.humidity + "%";
  document.getElementById("cw-wind").innerText = "Wind: " + data.wind.speed + " m/s";
}

// Forecast 
async function fetchForecast(lat, lon) {
  const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("forecast-cards");
  container.innerHTML = "";

  data.list.slice(0, 5).forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-white/10 p-3 rounded text-center";
    div.innerHTML = `
      <p>${new Date(item.dt * 1000).toDateString()}</p>
      <p>${convertTemp(item.main.temp)}°${currentUnit}</p>
    `;
    container.appendChild(div);
  });

  document.getElementById("forecast-section").classList.remove("hidden");
}

/* Save City */
function saveCity(city) {
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem('weather_recent', JSON.stringify(recentCities));
  }
}

/* Toggle Unit */
function toggleUnit(unit) {
  currentUnit = unit;

  document.getElementById("btn-c").classList.toggle("bg-blue-400", unit === "C");
  document.getElementById("btn-f").classList.toggle("bg-blue-400", unit === "F");

  if (currentTempKelvin) {
    document.getElementById("cw-temp").innerText = convertTemp(currentTempKelvin) + "°" + currentUnit;
  }
}
