// ===============================
// WEATHER DASHBOARD CHART
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("tempChart");

    if (!canvas) return;

    if (typeof hourlyLabels === "undefined") return;

    if (typeof hourlyTemps === "undefined") return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: hourlyLabels,

            datasets: [{

                label: "Temperature",

                data: hourlyTemps,

                borderColor: "#FFD54F",

                backgroundColor: "rgba(255,255,255,0.18)",

                fill: true,

                tension: 0.4,

                borderWidth: 4,

                pointRadius: 6,

                pointHoverRadius: 8,

                pointBackgroundColor: "#ffffff",

                pointBorderColor: "#FFD54F",

                pointBorderWidth: 3

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    backgroundColor: "#1f2937",

                    titleColor: "#ffffff",

                    bodyColor: "#ffffff",

                    displayColors: false,

                    callbacks: {

                        title: function(context) {

                            return context[0].label;

                        },

                        label: function(context) {

                            return context.parsed.y + " °C";

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        color: "#ffffff",

                        font: {

                            size: 13,

                            weight: "bold"

                        }

                    }

                },

                y: {

                    beginAtZero: false,

                    grace: "5%",

                    grid: {

                        color: "rgba(255,255,255,.15)"

                    },

                    ticks: {

                        color: "#ffffff",

                        callback: function(value) {

                            return value + "°";

                        }

                    }

                }

            }

        }

    });

});