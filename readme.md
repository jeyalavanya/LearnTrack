Weather Forecast Application Documentation:

📋 Table of Contents
Project Overview
File Structure
Setup Instructions
Usage Guide
API Integration
Features Breakdown


Project Overview:
A Weather Forecast Application featuring real-time weather data, 5-day forecasts, geolocation support, and dynamic weather-themed backgrounds. Built with HTML/CSS/JavaScript and Tailwind CSS for rapid deployment.

Key Capabilities:

City-based weather search with autocomplete validation

Browser geolocation for current position

Celsius/Fahrenheit temperature conversion

Recent cities persistence via localStorage

Dynamic gradient backgrounds matching weather conditions

Responsive design across all device sizes

Comprehensive error handling and user feedback

Setup Instructions
Prerequisites
Modern web browser (Chrome 90+, Firefox 90+, Safari 14+)

Internet connection for OpenWeatherMap API calls

Step-by-Step Deployment
Download Files
Place index.html and output.css / weatherForecast.js in the src folder of same directory.

Obtain API Key (Free)

text
1. Visit https://openweathermap.org/api
2. Create free account (1000 calls/day limit)
3. Copy API key from dashboard
Configure API Key
Open weatherForecast.js and replace line 3:
javascript:
## ⚠️ CRITICAL: Replace API Key (MUST DO)
const API_KEY = "YOUR_API_KEY_HERE";  // ← Replace this

Usage Guide
Primary Interactions
text
1. City Search: Type city name → Enter/Search button
2. Geolocation: Click "My Location" → Allow browser permissions
3. Unit Toggle: Click °C/°F button
4. Recent Cities: Select from dropdown (auto-saves last 5)
Expected Behavior
Background changes automatically based on weather condition

Current weather shows temperature, feels-like, humidity, wind, visibility, pressure

5-day forecast displays daily summaries with icons

Alerts appear for extreme temperatures (>40°C or <0°C)

API Integration:
OpenWeatherMap Endpoints Used
Endpoint	Purpose	Parameters	Response
/weather	Current conditions	q=city or lat/lon	Temperature, humidity, wind, etc.
/forecast	5-day hourly	q=city&cnt=40	40 timestamps (grouped by day)
Request Format
text
GET https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=YOUR_KEY&units=metric
Free Tier Limits
1000 calls/day

Current weather + 5-day forecast

Global coverage

1 call = 1 city search

Features Breakdown
1. Dual Search Methods
text
Manual: City name validation (letters + spaces only)
Auto:   Browser Geolocation API with timeout handling
1. Smart State Management
text
✅ Recent cities (max 5, deduplicated)
✅ Temperature unit persistence (session)
✅ Input validation (real-time)
✅ Loading states (button feedback)
1. Visual Feedback System
text
🎨 Dynamic backgrounds (4 weather states)
🚨 Error modals + inline messages
⏳ Loading spinners
✅ Smooth transitions (1s duration)
1. Data Processing
text
Current Weather: 6 metrics displayed
Forecast: 40 hourly → 5 daily summaries
Units: Real-time C°/F° recalculation
Wind: m/s → km/h conversion
Visibility: meters → km