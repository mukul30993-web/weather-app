import os
from datetime import datetime, timedelta, timezone

import requests
from dotenv import load_dotenv
from flask import Flask, render_template, request

load_dotenv()

app = Flask(__name__)
API_KEY = os.getenv("OPENWEATHER_API_KEY")

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution"
session = requests.Session()


def api_params(**params):
    if not API_KEY:
        raise RuntimeError("Weather service is not configured.")
    return {**params, "appid": API_KEY, "units": "metric"}


def local_time(timestamp, utc_offset):
    city_timezone = timezone(timedelta(seconds=utc_offset))
    return datetime.fromtimestamp(timestamp, city_timezone).strftime("%I:%M %p")


def weather_from_data(data):
    utc_offset = data.get("timezone", 0)
    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
        "timezone_offset": utc_offset,
        "temp": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "temp_min": round(data["main"]["temp_min"]),
        "temp_max": round(data["main"]["temp_max"]),
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "visibility": data.get("visibility", 0) // 1000,
        "wind": round(data["wind"]["speed"], 1),
        "clouds": data["clouds"]["all"],
        "sunrise": local_time(data["sys"]["sunrise"], utc_offset),
        "sunset": local_time(data["sys"]["sunset"], utc_offset),
        "description": data["weather"][0]["description"].title(),
        "main": data["weather"][0]["main"],
        "icon": data["weather"][0]["icon"],
    }


def get_current_weather(city=None, lat=None, lon=None):
    location = {"q": city} if city else {"lat": lat, "lon": lon}
    response = session.get(CURRENT_URL, params=api_params(**location), timeout=10)
    response.raise_for_status()
    return weather_from_data(response.json())


def get_hourly_and_forecast(city):
    response = session.get(FORECAST_URL, params=api_params(q=city), timeout=10)
    response.raise_for_status()
    data = response.json()

    hourly = [
        {
            "time": datetime.strptime(item["dt_txt"], "%Y-%m-%d %H:%M:%S").strftime("%I %p"),
            "temp": round(item["main"]["temp"]),
            "icon": item["weather"][0]["icon"],
        }
        for item in data["list"][:8]
    ]

    forecast, added = [], set()
    for item in data["list"]:
        if "12:00:00" not in item["dt_txt"]:
            continue
        day = datetime.strptime(item["dt_txt"], "%Y-%m-%d %H:%M:%S").strftime("%a")
        if day in added:
            continue
        forecast.append({"day": day, "temp": round(item["main"]["temp"]), "icon": item["weather"][0]["icon"], "desc": item["weather"][0]["main"]})
        added.add(day)
        if len(forecast) == 5:
            break
    return hourly, forecast


def get_air_quality(lat, lon):
    try:
        response = session.get(AIR_URL, params={"lat": lat, "lon": lon, "appid": API_KEY}, timeout=10)
        response.raise_for_status()
        return response.json()["list"][0]["main"]["aqi"]
    except requests.RequestException:
        return None


def page_context(weather=None, error=None):
    hourly, forecast, aqi = [], [], None
    if weather:
        hourly, forecast = get_hourly_and_forecast(weather["city"])
        aqi = get_air_quality(weather["lat"], weather["lon"])
    return {"weather": weather, "hourly": hourly, "forecast": forecast, "aqi": aqi, "error": error}


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        city = request.form.get("city", "").strip()
        if city:
            try:
                return render_template("index.html", **page_context(get_current_weather(city=city)))
            except requests.exceptions.HTTPError:
                return render_template("index.html", **page_context(error="City not found. Try another search."))
            except requests.exceptions.ConnectionError:
                return render_template("index.html", **page_context(error="No internet connection."))
            except requests.exceptions.Timeout:
                return render_template("index.html", **page_context(error="The weather request timed out. Please try again."))
            except RuntimeError as error:
                return render_template("index.html", **page_context(error=str(error)))
            except Exception:
                app.logger.exception("Weather request failed")
                return render_template("index.html", **page_context(error="Something went wrong. Please try again."))
    return render_template("index.html", **page_context())


@app.route("/location")
def location():
    lat, lon = request.args.get("lat"), request.args.get("lon")
    if not lat or not lon:
        return render_template("index.html", **page_context(error="Location coordinates are missing.")), 400
    try:
        return render_template("index.html", **page_context(get_current_weather(lat=lat, lon=lon)))
    except Exception:
        app.logger.exception("Location weather request failed")
        return render_template("index.html", **page_context(error="Unable to fetch weather for your location."))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
