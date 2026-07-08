// ======================================
// WEATHER DASHBOARD PRO
// PART 1
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    initializeChart();

    startClock();

    animateCards();

    animateForecast();

    animateWeatherIcon();

    buttonRipple();

});

// ======================================
// CHART.JS
// ======================================
function initializeChart() {

    console.log("initializeChart called");

    const canvas = document.getElementById("tempChart");

    if (!canvas) {
        console.log("Canvas not found");
        return;
    }

    if (typeof hourlyLabels === "undefined") {
        console.log("hourlyLabels is undefined");
        return;
    }

    if (typeof hourlyTemps === "undefined") {
        console.log("hourlyTemps is undefined");
        return;
    }

    console.log("Labels:", hourlyLabels);
    console.log("Temps:", hourlyTemps);

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);

    gradient.addColorStop(0, "rgba(255,213,79,0.45)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: hourlyLabels,
            datasets: [{
                label: "Temperature",
                data: hourlyTemps,
                borderColor: "#FFD54F",
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#FFD54F"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ffffff"
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: "#ffffff"
                    },
                    grid: {
                        color: "rgba(255,255,255,.1)"
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
// DETAILS CARDS
// ======================================

function animateCards(){

    const cards=document.querySelectorAll(".box");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{

            card.style.transition=".6s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*90);

    });

}

// ======================================
// FORECAST ANIMATION
// ======================================

function animateForecast(){

    const cards=document.querySelectorAll(".forecast-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(50px)";

        setTimeout(()=>{

            card.style.transition=".7s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*120);

    });

}

// ======================================
// WEATHER ICON
// ======================================

function animateWeatherIcon(){

    const icon=document.querySelector(".weather-icon img");

    if(!icon) return;

    let up=true;

    setInterval(()=>{

        icon.style.transform=

        up?

        "translateY(-12px)"

        :

        "translateY(0px)";

        up=!up;

    },1500);

}

// ======================================
// SEARCH BUTTON
// ======================================

function buttonRipple(){

    const btn=document.querySelector(".search-box button");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        btn.animate([

            {

                transform:"scale(1)"

            },

            {

                transform:"scale(.90)"

            },

            {

                transform:"scale(1)"

            }

        ],{

            duration:250

        });

    });

}
// ======================================
// WEATHER DASHBOARD PRO
// PART 2 - WEATHER EFFECTS
// ======================================

// Wait until page loads
window.addEventListener("load", () => {

    updateWeatherEffects();

});

// ======================================
// WEATHER EFFECTS
// ======================================

function updateWeatherEffects() {

    const body = document.body;

    const weather = body.className.toLowerCase();

    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
    const stars = document.querySelector(".stars");
    const rain = document.querySelector(".rain");
    const snow = document.querySelector(".snow");

    if(sun) sun.style.display="none";
    if(moon) moon.style.display="none";
    if(stars) stars.style.opacity="0";
    if(rain) rain.style.opacity="0";
    if(snow) snow.style.opacity="0";

    // Clear Weather

    if(weather.includes("clear")){

        if(sun){

            sun.style.display="block";

            rotateSun();

        }

    }

    // Clouds

    if(weather.includes("cloud")){

        animateClouds();

    }

    // Rain

    if(weather.includes("rain") || weather.includes("drizzle")){

        if(rain){

            rain.style.opacity="1";

        }

        rainAnimation();

    }

    // Snow

    if(weather.includes("snow")){

        if(snow){

            snow.style.opacity="1";

        }

        snowAnimation();

    }

}

// ======================================
// SUN ROTATION
// ======================================

function rotateSun(){

    const sun=document.querySelector(".sun");

    if(!sun) return;

    let angle=0;

    setInterval(()=>{

        angle+=0.2;

        sun.style.transform=`rotate(${angle}deg)`;

    },30);

}

// ======================================
// CLOUDS
// ======================================

function animateClouds(){

    const clouds=document.querySelectorAll(".cloud");

    clouds.forEach((cloud,index)=>{

        let pos=-250-(index*120);

        setInterval(()=>{

            pos+=0.3+(index*.15);

            if(pos>window.innerWidth+250){

                pos=-250;

            }

            cloud.style.left=pos+"px";

        },20);

    });

}

// ======================================
// RAIN
// ======================================

function rainAnimation(){

    const rain=document.querySelector(".rain");

    if(!rain) return;

    rain.innerHTML="";

    for(let i=0;i<180;i++){

        const drop=document.createElement("span");

        drop.className="drop";

        drop.style.left=Math.random()*100+"%";

        drop.style.animationDuration=

        (.4+Math.random()*.4)+"s";

        drop.style.animationDelay=

        Math.random()*2+"s";

        rain.appendChild(drop);

    }

}

// ======================================
// SNOW
// ======================================

function snowAnimation(){

    const snow=document.querySelector(".snow");

    if(!snow) return;

    snow.innerHTML="";

    for(let i=0;i<120;i++){

        const flake=document.createElement("span");

        flake.className="flake";

        flake.innerHTML="❄";

        flake.style.left=Math.random()*100+"%";

        flake.style.fontSize=

        (10+Math.random()*20)+"px";

        flake.style.animationDuration=

        (6+Math.random()*6)+"s";

        flake.style.animationDelay=

        Math.random()*5+"s";

        snow.appendChild(flake);

    }

}

// ======================================
// STARS
// ======================================

function createStars(){

    const stars=document.querySelector(".stars");

    if(!stars) return;

    stars.innerHTML="";

    for(let i=0;i<120;i++){

        const star=document.createElement("span");

        star.className="star";

        star.style.left=Math.random()*100+"%";

        star.style.top=Math.random()*100+"%";

        star.style.animationDelay=

        Math.random()*5+"s";

        stars.appendChild(star);

    }

}

createStars();

// ======================================
// LIGHTNING
// ======================================

function lightning(){

    const body=document.body;

    if(!body.className.includes("thunderstorm"))

        return;

    setInterval(()=>{

        document.body.animate([

            {

                filter:"brightness(1)"

            },

            {

                filter:"brightness(2)"

            },

            {

                filter:"brightness(1)"

            }

        ],{

            duration:250

        });

    },8000);

}

lightning();
// ======================================
// WEATHER DASHBOARD PRO
// PART 3 - PREMIUM FEATURES
// ======================================

// -------------------------------
// Animated Number Counter
// -------------------------------

function animateNumbers() {

    document.querySelectorAll(".box p").forEach(element => {

        const text = element.innerText;

        const match = text.match(/-?\d+/);

        if (!match) return;

        const target = parseInt(match[0]);

        let count = 0;

        const step = Math.max(1, Math.ceil(target / 50));

        const timer = setInterval(() => {

            count += step;

            if (count >= target) {

                count = target;

                clearInterval(timer);

            }

            element.innerText =
                text.replace(/-?\d+/, count);

        }, 20);

    });

}

// -------------------------------
// Smooth Fade In
// -------------------------------

function fadeInPage() {

    document.body.style.opacity = "0";

    document.body.style.transition =
        "opacity .8s ease";

    setTimeout(() => {

        document.body.style.opacity = "1";

    }, 100);

}

// -------------------------------
// Mouse Parallax
// -------------------------------

function mouseParallax() {

    document.addEventListener("mousemove", e => {

        const x = (e.clientX / window.innerWidth - .5) * 20;

        const y = (e.clientY / window.innerHeight - .5) * 20;

        document.querySelectorAll(".weather-card").forEach(card => {

            card.style.transform =
                `rotateY(${x/4}deg) rotateX(${-y/4}deg)`;

        });

    });

}

// -------------------------------
// Auto Scroll Forecast
// -------------------------------

function autoForecastScroll() {

    const forecast = document.getElementById("forecastCards");

    if (!forecast) return;

    let direction = 1;

    setInterval(() => {

        forecast.scrollLeft += direction;

        if (
            forecast.scrollLeft + forecast.clientWidth >=
            forecast.scrollWidth
        ) {

            direction = -1;

        }

        if (forecast.scrollLeft <= 0) {

            direction = 1;

        }

    }, 25);

}

// -------------------------------
// Card Glow Effect
// -------------------------------

function cardGlow() {

    document.querySelectorAll(".box,.forecast-card,.highlight-card")
        .forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;

                const y = e.clientY - rect.top;

                card.style.background =
                    `radial-gradient(circle at ${x}px ${y}px,
                    rgba(255,255,255,.28),
                    rgba(255,255,255,.10))`;

            });

            card.addEventListener("mouseleave", () => {

                card.style.background =
                    "rgba(255,255,255,.12)";

            });

        });

}

// -------------------------------
// Scroll Animation
// -------------------------------

function revealOnScroll() {

    const items = document.querySelectorAll(
        ".box,.forecast-card,.highlight-card"
    );

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    }, {

        threshold: .2

    });

    items.forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(40px)";

        observer.observe(item);

    });

}

// -------------------------------
// Weather Background Animation
// -------------------------------

function animateBackground() {

    let hue = 0;

    setInterval(() => {

        hue += .15;

        document.body.style.backgroundPosition =
            `${hue}px ${hue}px`;

    }, 40);

}

// -------------------------------
// Resize Fix
// -------------------------------

window.addEventListener("resize", () => {

    const chart = document.getElementById("tempChart");

    if (chart) {

        chart.style.height = "300px";

    }

});

// -------------------------------
// Initialize
// -------------------------------

window.addEventListener("load", () => {

    fadeInPage();

    animateNumbers();

    mouseParallax();

    autoForecastScroll();

    cardGlow();

    revealOnScroll();

    animateBackground();

});

// ======================================
// END OF SCRIPT
// ======================================