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
    error = None

    if request.method == "POST":

        city = request.form.get("city", "").strip()

        if city:

            try:

                params = {
                    "q": city,
                    "appid": API_KEY,
                    "units": "metric"
                }

                # ---------------- CURRENT WEATHER ---------------- #

                response = requests.get(CURRENT_URL, params=params)

                data = response.json()

                if response.status_code != 200:
                    error = data.get("message", "City not found").title()

                else:

                    weather = {

                        "city": data["name"],
                        "country": data["sys"]["country"],

                        "temp": round(data["main"]["temp"]),
                        "feels_like": round(data["main"]["feels_like"]),
                        "temp_min": round(data["main"]["temp_min"]),
                        "temp_max": round(data["main"]["temp_max"]),

                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],

                        "visibility": data["visibility"] // 1000,

                        "wind": round(data["wind"]["speed"],1),

                        "clouds": data["clouds"]["all"],

                        "sunrise": datetime.fromtimestamp(
                            data["sys"]["sunrise"]
                        ).strftime("%I:%M %p"),

                        "sunset": datetime.fromtimestamp(
                            data["sys"]["sunset"]
                        ).strftime("%I:%M %p"),

                        "description": data["weather"][0]["description"].title(),

                        "icon": data["weather"][0]["icon"],

                        "main": data["weather"][0]["main"]

                    }

                    # ---------------- 5 DAY FORECAST ---------------- #

                    forecast_response = requests.get(
                        FORECAST_URL,
                        params=params
                    )

                    forecast_data = forecast_response.json()

                    added_days = set()

                    for item in forecast_data["list"]:

                        if "12:00:00" in item["dt_txt"]:

                            day = datetime.strptime(
                                item["dt_txt"],
                                "%Y-%m-%d %H:%M:%S"
                            ).strftime("%a")

                            if day not in added_days:

                                forecast.append({

                                    "day": day,

                                    "temp": round(item["main"]["temp"]),

                                    "icon": item["weather"][0]["icon"],

                                    "desc": item["weather"][0]["main"]

                                })

                                added_days.add(day)

            except Exception:

                error = "Something went wrong."

    return render_template(

        "index.html",

        weather=weather,

        forecast=forecast,

        error=error

    )


if __name__ == "__main__":
    app.run(debug=True)