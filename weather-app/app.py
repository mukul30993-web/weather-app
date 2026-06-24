from flask import Flask, render_template, request
import requests

app = Flask(__name__)

API_KEY = "702d27dcbf1d3d8b7c570d52f6263bfb"

@app.route("/", methods=["GET", "POST"])
def home():

    weather = None

    if request.method == "POST":

        city = request.form["city"]

        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

        response = requests.get(url)

        data = response.json()

        if data.get("cod") == 200:

            weather = {
                "city": data["name"],
                "temp": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "description": data["weather"][0]["description"]
            }

    return render_template(
        "index.html",
        weather=weather
    )

if __name__ == "__main__":
    app.run(debug=True)