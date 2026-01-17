/**
 * Weather Forecast App
 * Uses OpenWeatherMap API (Free tier)
 * Features: City search, Geolocation, 5-day forecast, Background themes
 */

// ===== API CONFIGURATION =====
const API_KEY = "240598957831f47b7012bbd19431c404"; // OpenWeatherMap API Key
const API_BASE = "https://api.openweathermap.org/data/2.5"; // Current weather endpoint
const FORECAST_BASE = "https://api.openweathermap.org/data/2.5/forecast"; // 5-day forecast endpoint

const elements = {
  // Search controls
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  geoBtn: document.getElementById("geoBtn"),
  recentCities: document.getElementById("recentCities"),
  tempToggle: document.getElementById("tempToggle"),
  tempUnit: document.getElementById("tempUnit"),

  // Status displays
  errorMsg: document.getElementById("errorMsg"),
  weatherAlert: document.getElementById("weatherAlert"),

  // Weather sections
  currentWeather: document.getElementById("currentWeather"),
  forecastSection: document.getElementById("forecastSection"),
  forecastCards: document.getElementById("forecastCards"),

  // Current weather data displays
  currentLocation: document.getElementById("currentLocation"),
  currentIcon: document.getElementById("currentIcon"),
  currentDesc: document.getElementById("currentDesc"),
  currentTemp: document.getElementById("currentTemp"),
  currentFeels: document.getElementById("currentFeels"),
  currentHumidity: document.getElementById("currentHumidity"),
  currentWind: document.getElementById("currentWind"),
  currentVisibility: document.getElementById("currentVisibility"),
  currentPressure: document.getElementById("currentPressure"),

  // Modal elements
  errorModal: document.getElementById("errorModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  closeModal: document.getElementById("closeModal"),
};

// ===== APP STATE =====
let isCelsius = true; // Current temperature unit
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || []; // Recently searched cities
let currentWeatherData = null; // Currently displayed weather data

// ===== WEATHER ICON MAPPING =====
const weatherIcons = {
  Clear: "fas fa-sun", // ☀️ Sunny
  Clouds: "fas fa-cloud", // ☁️ Cloudy
  Rain: "fas fa-cloud-rain", // 🌧️ Rainy
  Drizzle: "fas fa-cloud-drizzle", // 🌦️ Light rain
  Thunderstorm: "fas fa-bolt", // ⛈️ Storm
  Snow: "fas fa-snowflake", // ❄️ Snow
  Mist: "fas fa-smog", // 🌫️ Mist
  Smoke: "fas fa-smog", // 💨 Smoke
  Haze: "fas fa-smog", // 🌁 Haze
  Dust: "fas fa-wind", // 🌪️ Dust
  Fog: "fas fa-smog", // 🌫️ Fog
};

// ===== APP INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initRecentCities(); // Load recent cities from localStorage
  setupEventListeners(); // Bind all event handlers
  loadRecentCitiesDropdown(); // Populate recent cities dropdown
});

/**
 * Setup all UI event listeners
 */
function setupEventListeners() {
  // Search functionality
  elements.searchBtn.addEventListener("click", handleSearch);
  elements.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch(); // Enter key triggers search
  });

  // Navigation & controls
  elements.geoBtn.addEventListener("click", getCurrentLocation);
  elements.tempToggle.addEventListener("click", toggleTemperatureUnit);
  elements.recentCities.addEventListener("change", handleRecentCitySelect);
  elements.closeModal.addEventListener("click", closeErrorModal);

  // Modal outside click to close
  elements.errorModal.addEventListener("click", (e) => {
    if (e.target === elements.errorModal) {
      elements.cityInput.value = ""; // Clear input
      closeErrorModal();
    }
  });
}

/**
 * Main search handler - Search weather by city name
 */
async function handleSearch() {
  const city = elements.cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  hideError();
  showLoading();

  try {
    const weatherData = await fetchWeatherData(city);
    displayWeather(weatherData, city);
    addToRecentCities(city);
    elements.cityInput.value = ""; // Clear input
  } catch (error) {
    showError(
      `City "${city}" not found. Please check the spelling and try again.`,
    );
  }
}

/**
 * Get user's current location using browser Geolocation API
 */
async function getCurrentLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherByCoords(latitude, longitude);
        displayWeather(weatherData, weatherData.name);
        addToRecentCities(weatherData.name);
      } catch (error) {
        showError("Unable to fetch weather for your location.");
      }
    },
    (error) => {
      // Detailed geolocation error handling
      let message = "Location access failed. ";
      if (error.code === 1) {
        message += "Please enable location permissions and try again.";
      } else if (error.code === 3) {
        message += "Location services too slow. Try manual search.";
      } else if (error.code === 2) {
        message += "Location unavailable. Try manual search.";
      } else {
        message += "Please check your internet connection.";
      }
      showError(message);
    },
    {
      timeout: 45000, // 5 second timeout
      enableHighAccuracy: false, // Faster location
      maximumAge: 600000, // Cache up to 10 minutes
    },
  );
}

/**
 * Handle recent city selection from dropdown
 */
function handleRecentCitySelect() {
  const city = elements.recentCities.value;
  if (city) {
    elements.cityInput.value = city;
    handleSearch();
    elements.recentCities.value = "";
  }
}

/**
 * Toggle between Celsius (°C) and Fahrenheit (°F)
 */
function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  elements.tempUnit.textContent = isCelsius ? "°C" : "°F";

  // Update current display if weather data exists
  if (currentWeatherData) {
    displayTemperature(
      currentWeatherData.main.temp,
      currentWeatherData.main.feels_like,
    );
    checkWeatherAlert(currentWeatherData.main.temp);
  }
}

// ===== API FETCH FUNCTIONS =====
/**
 * Fetch current weather data by city name
 * @param {string} city - City name to search
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
  const url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "City not found");
  }

  return response.json();
}

/**
 * Fetch current weather by geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherByCoords(lat, lon) {
  const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Unable to fetch location data");

  const data = await response.json();
  return data;
}

/**
 * Fetch 5-day weather forecast (40 timestamps, grouped by day)
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data
 */
async function fetchForecast(city) {
  const url = `${FORECAST_BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Unable to fetch forecast data");

  return response.json();
}

// ===== DISPLAY FUNCTIONS =====
/**
 * Display current weather data and load forecast
 */
async function displayWeather(weatherData, locationName) {
  currentWeatherData = weatherData;

  // Update location and weather description
  elements.currentLocation.textContent = locationName;
  elements.currentIcon.className =
    weatherIcons[weatherData.weather[0].main] || "fas fa-cloud";
  elements.currentDesc.textContent =
    weatherData.weather[0].description.toUpperCase();

  // Update all weather statistics
  displayTemperature(weatherData.main.temp, weatherData.main.feels_like);
  elements.currentHumidity.textContent = `${weatherData.main.humidity}%`;
  elements.currentWind.textContent = `${(weatherData.wind.speed * 3.6).toFixed(1)} km/h`;
  elements.currentVisibility.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
  elements.currentPressure.textContent = `${weatherData.main.pressure} hPa`;

  // Dynamic background based on weather condition
  updateWeatherBackground(weatherData.weather[0].main);

  // Check for extreme weather alerts
  checkWeatherAlert(weatherData.main.temp);

  // Show current weather section
  elements.currentWeather.classList.remove("hidden");

  // Load and display forecast
  try {
    const forecastData = await fetchForecast(locationName);
    displayForecast(forecastData);
    elements.forecastSection.classList.remove("hidden");
  } catch (error) {
    console.warn("Forecast unavailable:", error);
  }

  hideLoading();
}

/**
 * Convert and display temperature in current unit
 */
function displayTemperature(tempC, feelsLikeC) {
  const tempF = (tempC * 9) / 5 + 32;
  const feelsLikeF = (feelsLikeC * 9) / 5 + 32;

  elements.currentTemp.textContent = isCelsius
    ? `${Math.round(tempC)}°`
    : `${Math.round(tempF)}°`;
  elements.currentFeels.textContent = `Feels like ${
    isCelsius ? `${Math.round(feelsLikeC)}°` : `${Math.round(feelsLikeF)}°`
  }`;
}

/**
 * Display 5-day forecast cards (groups forecast by day)
 */
function displayForecast(forecastData) {
  elements.forecastCards.innerHTML = "";

  // Group forecast data by day
  const dailyForecasts = {};
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();

    if (!dailyForecasts[dayKey]) {
      dailyForecasts[dayKey] = [];
    }
    dailyForecasts[dayKey].push(item);
  });

  // Display first 5 days only
  const days = Object.keys(dailyForecasts).slice(0, 5);

  days.forEach((dayKey, index) => {
    const dayData = dailyForecasts[dayKey][0]; // Use first forecast of the day
    const date = new Date(dayKey);

    const card = document.createElement("div");
    card.className =
      "bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-blue-200 hover:-translate-y-2";
    card.innerHTML = `
      <div class="text-center mb-4">
        <p class="text-sm text-gray-500">${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
        <i class="${weatherIcons[dayData.weather[0].main] || "fas fa-cloud"} text-4xl text-blue-500 mb-3"></i>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-center gap-2">
          <i class="fas fa-thermometer-half text-orange-500 text-lg"></i>
          <span class="text-2xl font-bold">${Math.round(dayData.main.temp)}°C</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-tint text-blue-400"></i>
          <span>${dayData.main.humidity}%</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-wind text-gray-500"></i>
          <span>${(dayData.wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
      </div>
    `;
    elements.forecastCards.appendChild(card);
  });
}

/**
 * Update page background based on current weather condition
 */
function updateWeatherBackground(condition) {
  // Remove all existing background classes
  document.body.classList.remove(
    "rainy-bg",
    "sunny-bg",
    "cloudy-bg",
    "default-bg",
    "bg-gradient-to-br",
    "from-gray-600",
    "via-blue-800",
    "to-gray-900",
    "from-yellow-200",
    "via-orange-200",
    "to-pink-200",
  );

  // Apply new background class based on weather
  const bgClass =
    condition === "Rain"
      ? "rainy-bg"
      : condition === "Clear"
        ? "sunny-bg"
        : condition === "Clouds"
          ? "cloudy-bg"
          : "default-bg";

  document.body.classList.add(
    "min-h-screen",
    "transition-all",
    "duration-1000",
    bgClass,
  );
}

/**
 * Check for extreme weather conditions and show alerts
 */
function checkWeatherAlert(tempC) {
  elements.weatherAlert.classList.add("hidden");

  if (tempC > 40) {
    // Extreme heat warning
    elements.weatherAlert.innerHTML = `
      <div class="flex items-center gap-4">
        <i class="fas fa-exclamation-triangle text-2xl animate-pulse"></i>
        <div>
          <h3 class="text-xl font-bold mb-1">🌡️ EXTREME HEAT ALERT</h3>
          <p>Temperature exceeds 40°C. Stay hydrated and avoid prolonged sun exposure.</p>
        </div>
      </div>
    `;
    elements.weatherAlert.classList.remove("hidden");
  } else if (tempC < 0) {
    // Freezing warning
    elements.weatherAlert.innerHTML = `
      <div class="flex items-center gap-4">
        <i class="fas fa-snowflake text-2xl animate-pulse"></i>
        <div>
          <h3 class="text-xl font-bold mb-1">❄️ FREEZING ALERT</h3>
          <p>Temperature below 0°C. Wear warm clothing and be cautious of icy conditions.</p>
        </div>
      </div>
    `;
    elements.weatherAlert.classList.remove("hidden");
  }
}

// ===== RECENT CITIES MANAGEMENT =====
/**
 * Add city to recent searches (max 5 cities)
 */
function addToRecentCities(city) {
  // Remove existing instance of this city (avoid duplicates)
  recentCities = recentCities.filter(
    (c) => c.toLowerCase() !== city.toLowerCase(),
  );
  recentCities.unshift(city); // Add to beginning
  recentCities = recentCities.slice(0, 5); // Keep only last 5
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  loadRecentCitiesDropdown();
}

/**
 * Initialize recent cities system
 */
function initRecentCities() {
  loadRecentCitiesDropdown();
}

/**
 * Populate recent cities dropdown menu
 */
function loadRecentCitiesDropdown() {
  elements.recentCities.innerHTML = '<option value="">Recent Cities</option>';
  recentCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    elements.recentCities.appendChild(option);
  });
}

// ===== UI UTILITY FUNCTIONS =====
/**
 * Show error message with modal and inline display
 */
function showError(message) {
  elements.errorMsg.textContent = message;
  elements.errorMsg.classList.remove("hidden");
  elements.errorMsg.scrollIntoView({ behavior: "smooth" });

  // Show modal for critical errors
  elements.modalTitle.textContent = "Weather Data Unavailable";
  elements.modalMessage.textContent = message;
  elements.errorModal.classList.remove("hidden");
}

/**
 * Hide all error displays
 */
function hideError() {
  elements.errorMsg.classList.add("hidden");
  elements.errorModal.classList.add("hidden");
}

/**
 * Close error modal manually
 */
function closeErrorModal() {
  elements.errorModal.classList.add("hidden");
  hideLoading();
  hideError();
}

/**
 * Show loading state on buttons
 */
function showLoading() {
  elements.searchBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i>Searching...';
  elements.searchBtn.disabled = true;
  elements.geoBtn.disabled = true;
}

/**
 * Hide loading state and restore buttons
 */
function hideLoading() {
  elements.searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Search';
  elements.searchBtn.disabled = false;
  elements.geoBtn.disabled = false;
}

/**
 * Input validation - City names only (letters and spaces)
 */
elements.cityInput.addEventListener("input", function () {
  const value = this.value.trim();
  if (value.length > 0 && !/^[a-zA-Z\s]+$/.test(value)) {
    this.setCustomValidity("City name should only contain letters and spaces");
  } else {
    this.setCustomValidity("");
  }
});
