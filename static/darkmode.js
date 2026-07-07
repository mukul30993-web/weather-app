// ===============================
// DARK MODE TOGGLE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const button = document.getElementById("themeToggle");

    // Restore saved theme

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

        if (button) {
            button.innerHTML =
                '<i class="fa-solid fa-sun"></i>';
        }

    }

    if (button) {

        button.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            if (body.classList.contains("dark-mode")) {

                localStorage.setItem("theme", "dark");

                button.innerHTML =
                    '<i class="fa-solid fa-sun"></i>';

            }

            else {

                localStorage.setItem("theme", "light");

                button.innerHTML =
                    '<i class="fa-solid fa-moon"></i>';

            }

        });

    }

});