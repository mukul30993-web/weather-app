// ======================================
// WEATHER DASHBOARD PRO
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    initializeChart();

    animateCards();

    animateForecast();

    animateWeatherIcon();

    startClock();

    buttonRipple();

    pageAnimation();

});

// ======================================
// CHART.JS
// ======================================

function initializeChart() {

    const canvas = document.getElementById("tempChart");

    if (!canvas) return;

    if (typeof hourlyLabels === "undefined") return;

    if (typeof hourlyTemps === "undefined") return;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0,0,0,350);

    gradient.addColorStop(0,"rgba(255,213,79,.45)");
    gradient.addColorStop(1,"rgba(255,255,255,0)");

    new Chart(ctx,{

        type:"line",

        data:{

            labels:hourlyLabels,

            datasets:[{

                label:"Temperature",

                data:hourlyTemps,

                borderColor:"#FFD54F",

                backgroundColor:gradient,

                fill:true,

                borderWidth:4,

                tension:.45,

                pointRadius:6,

                pointHoverRadius:9,

                pointBackgroundColor:"#fff",

                pointBorderColor:"#FFD54F",

                pointBorderWidth:3

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                },

                tooltip:{

                    displayColors:false,

                    backgroundColor:"#111827",

                    titleColor:"#fff",

                    bodyColor:"#fff",

                    callbacks:{

                        label:function(context){

                            return context.parsed.y+" °C";

                        }

                    }

                }

            },

            interaction:{

                mode:"index",

                intersect:false

            },

            scales:{

                x:{

                    grid:{

                        display:false

                    },

                    ticks:{

                        color:"#fff"

                    }

                },

                y:{

                    grid:{

                        color:"rgba(255,255,255,.12)"

                    },

                    ticks:{

                        color:"#fff",

                        callback:function(value){

                            return value+"°";

                        }

                    }

                }

            }

        }

    });

}

// ======================================
// LIVE CLOCK
// ======================================

function startClock(){

    const clock=document.getElementById("liveClock");

    if(!clock) return;

    function update(){

        const now=new Date();

        clock.innerHTML=now.toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        });

    }

    update();

    setInterval(update,1000);

}
// ======================================
// WEATHER ICON FLOAT
// ======================================

function animateWeatherIcon(){

    const icon=document.querySelector(".weather-img");

    if(!icon) return;

    icon.animate([

        {transform:"translateY(0px)"},

        {transform:"translateY(-12px)"},

        {transform:"translateY(0px)"}

    ],{

        duration:3000,

        iterations:Infinity

    });

}

// ======================================
// WEATHER DETAILS ANIMATION
// ======================================

function animateCards(){

    const cards=document.querySelectorAll(".box");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".6s ease";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*80);

    });

}

// ======================================
// FORECAST ANIMATION
// ======================================

function animateForecast(){

    const cards=document.querySelectorAll(".forecast-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".7s ease";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

}

// ======================================
// SEARCH BUTTON RIPPLE
// ======================================

function buttonRipple(){

    const btn=document.querySelector(".search-box button");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        btn.animate([

            {transform:"scale(1)"},

            {transform:"scale(.92)"},

            {transform:"scale(1.05)"},

            {transform:"scale(1)"}

        ],{

            duration:350,

            easing:"ease"

        });

    });

}

// ======================================
// PAGE FADE
// ======================================

function pageAnimation(){

    document.body.animate([

        {

            opacity:0,

            transform:"translateY(25px)"

        },

        {

            opacity:1,

            transform:"translateY(0)"

        }

    ],{

        duration:700,

        easing:"ease-out"

    });

}

// ======================================
// CARD HOVER EFFECT
// ======================================

document.querySelectorAll(".box,.forecast-card,.highlight-card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px) scale(1.03)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0) scale(1)";

    });

});

// ======================================
// CHART RESIZE
// ======================================

window.addEventListener("resize",()=>{

    if(window.myChart){

        window.myChart.resize();

    }

});

// ======================================
// WEATHER BACKGROUND EFFECT
// ======================================

const body=document.body;

if(body.classList.contains("clear")){

    document.querySelector(".sun")?.classList.add("active");

}

if(body.classList.contains("rain")){

    document.querySelector(".rain")?.classList.add("active");

}

if(body.classList.contains("snow")){

    document.querySelector(".snow")?.classList.add("active");

}

if(body.classList.contains("clouds")){

    document.querySelectorAll(".cloud").forEach(cloud=>{

        cloud.style.opacity=".35";

    });

}

console.log("Weather Dashboard Loaded Successfully");
// =====================================
// GPS LOCATION
// =====================================

const locationBtn = document.getElementById("locationBtn");

console.log(locationBtn);

if (locationBtn) {

    locationBtn.onclick = function () {

        alert("GPS button clicked");

        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
           function(position){

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    window.location.href = "/location?lat=" + lat + "&lon=" + lon;

},
            function(error){

                alert(error.message);

            }
        );

    };

}

function getLocationSuccess(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

}

function getLocationError() {

    alert("Unable to access your location.");

}