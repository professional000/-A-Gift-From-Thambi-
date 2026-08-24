document.addEventListener("DOMContentLoaded", function () {

    const startScreen = document.getElementById("startScreen");
    const mainContent = document.getElementById("mainContent");
    const startBtn = document.getElementById("startBtn");
    const music = document.getElementById("bgMusic");

    console.log("Website JS Loaded");

    if (!startBtn) {
        console.error("ERROR: startBtn not found");
        return;
    }

    startBtn.addEventListener("click", function () {

        console.log("Open Your Gift clicked");

        // Hide opening screen
        startScreen.style.display = "none";

        // Show main website
        mainContent.classList.remove("hidden");
        mainContent.style.display = "block";

        // Start music
        if (music) {

            music.volume = 0.65;

            music.play()
                .then(() => {
                    console.log("Music started");
                })
                .catch((error) => {
                    console.log(
                        "Music could not start:",
                        error
                    );
                });
        }

        // Go to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});
