// ======================================
// WEATHER DASHBOARD PRO
// DARK MODE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const button = document.getElementById("themeToggle");

    if (!button) return;

    // ===============================
    // Load Saved Theme
    // ===============================

    const savedTheme = localStorage.getItem("weather-theme");

    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

        button.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        button.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

    // ===============================
    // Theme Toggle
    // ===============================

    button.addEventListener("click", () => {

        button.classList.add("rotate");

        setTimeout(() => {

            button.classList.remove("rotate");

        }, 500);

        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {

            localStorage.setItem("weather-theme", "dark");

            button.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

            enableNightMode();

        } else {

            localStorage.setItem("weather-theme", "light");

            button.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

            enableDayMode();

        }

    });

    // Apply correct mode on page load

    if (body.classList.contains("dark-mode")) {

        enableNightMode();

    } else {

        enableDayMode();

    }

});

// ======================================
// DAY MODE
// ======================================

function enableDayMode() {

    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
    const stars = document.querySelector(".stars");

    if (sun) {

        sun.style.display = "block";

    }

    if (moon) {

        moon.style.display = "none";

    }

    if (stars) {

        stars.style.opacity = "0";

    }

}

// ======================================
// NIGHT MODE
// ======================================

function enableNightMode() {

    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
    const stars = document.querySelector(".stars");

    if (sun) {

        sun.style.display = "none";

    }

    if (moon) {

        moon.style.display = "block";

    }

    if (stars) {

        stars.style.opacity = ".8";

    }

}

// ======================================
// Keyboard Shortcut
// Press D to Toggle Theme
// ======================================

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() !== "d") return;

    const btn = document.getElementById("themeToggle");

    if (btn) {

        btn.click();

    }

});

// ======================================
// Smooth Transition
// ======================================

window.addEventListener("load", () => {

    document.body.classList.add("theme-transition");

});