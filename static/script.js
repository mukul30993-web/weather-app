let weatherChart = null;

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("tempChart");

    if (!canvas) return;

    const temp = parseInt(
        document.querySelector(".weather-text h2").innerText
    );

    const data = [
        temp - 2,
        temp,
        temp - 1,
        temp - 3
    ];

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(canvas, {

        type: "line",

        data: {
            labels: [
                "Morning",
                "Noon",
                "Evening",
                "Night"
            ],

            datasets: [{
                data: data,
                borderColor: "#ffffff",
                backgroundColor: "rgba(255,255,255,.15)",
                fill: true,
                tension: .4,
                borderWidth: 4,
                pointRadius: 5
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            }

        }

    });

});