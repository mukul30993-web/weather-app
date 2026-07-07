from flask import Flask, render_template, request
import requests
from datetime import datetime

app = Flask(__name__)

API_KEY = "702d27dcbf1d3d8b7c570d52f6263bfb"

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


@app.route("/", methods=["GET", "POST"])
def home():

    weather = None
    forecast = []
    hourly = []
    error = None

    if request.method == "POST":

        city = request.form.get("city", "").strip()

        if city:

            params = {
                "q": city,
                "appid": API_KEY,
                "units": "metric"
            }

            try:

                # Current Weather
                current = requests.get(
                    CURRENT_URL,
                    params=params,
                    timeout=10
                )

                current.raise_for_status()

                current = current.json()

                weather = {

                    "city": current["name"],
                    "country": current["sys"]["country"],

                    "temp": round(current["main"]["temp"]),
                    "feels_like": round(current["main"]["feels_like"]),
                    "temp_min": round(current["main"]["temp_min"]),
                    "temp_max": round(current["main"]["temp_max"]),

                    "humidity": current["main"]["humidity"],
                    "pressure": current["main"]["pressure"],
                    "visibility": current.get("visibility", 0) // 1000,

                    "wind": round(current["wind"]["speed"], 1),
                    "clouds": current["clouds"]["all"],

                    "sunrise": datetime.fromtimestamp(
                        current["sys"]["sunrise"]
                    ).strftime("%I:%M %p"),

                    "sunset": datetime.fromtimestamp(
                        current["sys"]["sunset"]
                    ).strftime("%I:%M %p"),

                    "description": current["weather"][0]["description"].title(),
                    "icon": current["weather"][0]["icon"],
                    "main": current["weather"][0]["main"]

                }

                # Forecast
                forecast_data = requests.get(
                    FORECAST_URL,
                    params=params,
                    timeout=10
                )

                forecast_data.raise_for_status()

                forecast_data = forecast_data.json()

                # Hourly (Next 24 Hours)

                for item in forecast_data["list"][:8]:

                    hourly.append({

                        "time": datetime.strptime(
                            item["dt_txt"],
                            "%Y-%m-%d %H:%M:%S"
                        ).strftime("%I %p"),

                        "temp": round(item["main"]["temp"])

                    })

                # 5 Day Forecast

                added = set()

                for item in forecast_data["list"]:

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

            except requests.exceptions.HTTPError:

                error = "City not found."

            except requests.exceptions.ConnectionError:

                error = "No Internet Connection."

            except requests.exceptions.Timeout:

                error = "Request Timed Out."

            except Exception as e:

                print(e)

                error = "Something went wrong."

    return render_template(
        "index.html",
        weather=weather,
        forecast=forecast,
        hourly=hourly,
        error=error
    )


if __name__ == "__main__":
    app.run(debug=True)