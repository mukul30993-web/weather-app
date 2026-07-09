from flask import Flask, render_template, request
import requests
from datetime import datetime

app = Flask(__name__)

API_KEY = "702d27dcbf1d3d8b7c570d52f6263bfb"

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
AIR_URL = "https://api.openweathermap.org/data/2.5/air_pollution"

session = requests.Session()


def get_current_weather(city):

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    response = session.get(CURRENT_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    weather = {
        "city": data["name"],
        "country": data["sys"]["country"],

        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],

        "temp": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "temp_min": round(data["main"]["temp_min"]),
        "temp_max": round(data["main"]["temp_max"]),

        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "visibility": data.get("visibility", 0) // 1000,

        "wind": round(data["wind"]["speed"], 1),
        "clouds": data["clouds"]["all"],

        "sunrise": datetime.fromtimestamp(
            data["sys"]["sunrise"]
        ).strftime("%I:%M %p"),

        "sunset": datetime.fromtimestamp(
            data["sys"]["sunset"]
        ).strftime("%I:%M %p"),

        "description": data["weather"][0]["description"].title(),
        "main": data["weather"][0]["main"],
        "icon": data["weather"][0]["icon"]
    }

    return weather
# ==========================================
# Current Weather by GPS Coordinates
# ==========================================

def get_current_weather_by_coords(lat, lon):

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "metric"
    }

    response = session.get(CURRENT_URL, params=params, timeout=10)
    response.raise_for_status()

    data = response.json()

    weather = {
        "city": data["name"],
        "country": data["sys"]["country"],

        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],

        "temp": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "temp_min": round(data["main"]["temp_min"]),
        "temp_max": round(data["main"]["temp_max"]),

        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],

        "visibility": data.get("visibility", 0) // 1000,

        "wind": round(data["wind"]["speed"], 1),

        "clouds": data["clouds"]["all"],

        "sunrise": datetime.fromtimestamp(
            data["sys"]["sunrise"]
        ).strftime("%I:%M %p"),

        "sunset": datetime.fromtimestamp(
            data["sys"]["sunset"]
        ).strftime("%I:%M %p"),

        "description": data["weather"][0]["description"].title(),

        "main": data["weather"][0]["main"],

        "icon": data["weather"][0]["icon"]
    }

    return weather


# ==========================================
# Hourly Forecast + 5-Day Forecast
# ==========================================

def get_hourly_and_forecast(city):

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    response = session.get(
        FORECAST_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    hourly = []

    for item in data["list"][:8]:

        hourly.append({

            "time": datetime.strptime(
                item["dt_txt"],
                "%Y-%m-%d %H:%M:%S"
            ).strftime("%I %p"),

            "temp": round(item["main"]["temp"]),

            "icon": item["weather"][0]["icon"]

        })

    forecast = []

    added = set()

    for item in data["list"]:

        if "12:00:00" not in item["dt_txt"]:
            continue

        day = datetime.strptime(
            item["dt_txt"],
            "%Y-%m-%d %H:%M:%S"
        ).strftime("%a")

        if day in added:
            continue

        forecast.append({

            "day": day,

            "temp": round(item["main"]["temp"]),

            "icon": item["weather"][0]["icon"],

            "desc": item["weather"][0]["main"]

        })

        added.add(day)

        if len(forecast) == 5:
            break

    return hourly, forecast
# ==========================================
# Air Quality
# ==========================================

def get_air_quality(lat, lon):

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY
    }

    try:

        response = session.get(
            AIR_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        return data["list"][0]["main"]["aqi"]

    except Exception:

        return None


# ==========================================
# Home Route (Search by City)
# ==========================================

@app.route("/", methods=["GET", "POST"])
def home():

    weather = None
    hourly = []
    forecast = []
    aqi = None
    error = None

    if request.method == "POST":

        city = request.form.get("city", "").strip()

        if city:

            try:

                weather = get_current_weather(city)

                hourly, forecast = get_hourly_and_forecast(city)

                aqi = get_air_quality(
                    weather["lat"],
                    weather["lon"]
                )

            except requests.exceptions.HTTPError:

                error = "City not found."

            except requests.exceptions.ConnectionError:

                error = "No internet connection."

            except requests.exceptions.Timeout:

                error = "Request timed out."

            except Exception as e:

                print(e)

                error = "Something went wrong."

    return render_template(
        "index.html",
        weather=weather,
        hourly=hourly,
        forecast=forecast,
        aqi=aqi,
        error=error
    )
# ==========================================
# GPS Location Route
# ==========================================

@app.route("/location")
def location():

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return "Invalid location"

    try:

        weather = get_current_weather_by_coords(lat, lon)

        hourly, forecast = get_hourly_and_forecast(
            weather["city"]
        )

        aqi = get_air_quality(
            weather["lat"],
            weather["lon"]
        )

        return render_template(
            "index.html",
            weather=weather,
            hourly=hourly,
            forecast=forecast,
            aqi=aqi,
            error=None
        )

    except Exception as e:

        print(e)

        return render_template(
            "index.html",
            weather=None,
            hourly=[],
            forecast=[],
            aqi=None,
            error="Unable to fetch location weather."
        )


# ==========================================
# Run Flask App
# ==========================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)