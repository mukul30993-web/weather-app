# Atmos Weather Dashboard

A responsive Flask weather dashboard that shows current conditions, hourly temperatures, a five-day forecast, air quality, city-local time, and location-based weather.

## Features

- Search any city or use browser GPS location
- Current weather, AQI, sunrise/sunset, and hourly temperature chart
- Five-day forecast and recent-city shortcuts
- Responsive light and dark themes with weather-aware animations
- API key kept out of source control with environment variables

## Run locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

Add your OpenWeather API key to `.env`:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Then visit `http://127.0.0.1:5000`.

## Project structure

```text
app.py              Flask application
templates/          HTML templates
static/             CSS and browser JavaScript
requirements.txt    Python dependencies
.env.example        Environment-variable template
```
