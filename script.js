document.addEventListener("DOMContentLoaded", () => {

    const startScreen = document.getElementById("startScreen");
    const mainContent = document.getElementById("mainContent");
    const startBtn = document.getElementById("startBtn");
    const music = document.getElementById("bgMusic");


    /* =========================
       START WEBSITE
    ========================= */

    startBtn.addEventListener("click", async () => {

        startScreen.classList.add("hidden");
        mainContent.classList.remove("hidden");

        try {
            music.volume = 0.65;
            await music.play();
        } catch (error) {
            console.log("Music playback was blocked:", error);
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    /* =========================
       SCRATCH CARD
    ========================= */

    const canvases =
        document.querySelectorAll(".scratch-canvas");


    canvases.forEach((canvas) => {

        const container = canvas.parentElement;

        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });

        let isDrawing = false;

        let lastX = 0;
        let lastY = 0;


        function setupCanvas() {

            const rect = container.getBoundingClientRect();

            const dpr = Math.max(
                1,
                window.devicePixelRatio || 1
            );

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            /* Scratch Cover */

            const gradient = ctx.createLinearGradient(
                0,
                0,
                rect.width,
                rect.height
            );

            gradient.addColorStop(0, "#8f6474");
            gradient.addColorStop(.5, "#d3a5b3");
            gradient.addColorStop(1, "#74505f");

            ctx.fillStyle = gradient;

            ctx.fillRect(
                0,
                0,
                rect.width,
                rect.height
            );


            /* Texture */

            for (let i = 0; i < 800; i++) {

                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;

                ctx.fillStyle =
                    `rgba(255,255,255,${Math.random() * .08})`;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    Math.random() * 2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }


            /* Cover Text */

            ctx.fillStyle = "rgba(255,255,255,.9)";

            ctx.font =
                "bold 20px Georgia";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                "✨ Scratch Me ✨",
                rect.width / 2,
                rect.height / 2
            );
        }


        function getPosition(event) {

            const rect =
                canvas.getBoundingClientRect();

            let clientX;
            let clientY;


            if (event.touches && event.touches.length) {

                clientX =
                    event.touches[0].clientX;

                clientY =
                    event.touches[0].clientY;

            } else {

                clientX = event.clientX;
                clientY = event.clientY;
            }


            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }


        function scratch(event) {

            if (!isDrawing) return;

            event.preventDefault();

            const pos =
                getPosition(event);


            ctx.globalCompositeOperation =
                "destination-out";


            ctx.lineWidth = 45;

            ctx.lineCap = "round";

            ctx.lineJoin = "round";


            ctx.beginPath();

            ctx.moveTo(
                lastX,
                lastY
            );

            ctx.lineTo(
                pos.x,
                pos.y
            );

            ctx.stroke();


            /* Scratch Circle */

            ctx.beginPath();

            ctx.arc(
                pos.x,
                pos.y,
                23,
                0,
                Math.PI * 2
            );

            ctx.fill();


            lastX = pos.x;
            lastY = pos.y;


            checkReveal();
        }


        function startScratch(event) {

            isDrawing = true;

            const pos =
                getPosition(event);

            lastX = pos.x;
            lastY = pos.y;

            event.preventDefault();
        }


        function stopScratch() {

            isDrawing = false;
        }


        function checkReveal() {

            const width = canvas.width;
            const height = canvas.height;

            const sample =
                ctx.getImageData(
                    0,
                    0,
                    width,
                    height
                );


            let transparent = 0;

            const total =
                sample.data.length / 4;


            /* Check every 16th pixel for performance */

            for (
                let i = 3;
                i < sample.data.length;
                i += 64
            ) {

                if (sample.data[i] < 80) {
                    transparent++;
                }
            }


            const sampledTotal =
                Math.ceil(total / 16);


            const percentage =
                (transparent / sampledTotal) * 100;


            /* Auto reveal after 55% scratch */

            if (percentage > 55) {

                ctx.clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                canvas.style.pointerEvents =
                    "none";

                const text =
                    container.querySelector(".scratch-text");

                if (text) {
                    text.style.display = "none";
                }
            }
        }


        /* Mouse */

        canvas.addEventListener(
            "mousedown",
            startScratch
        );

        canvas.addEventListener(
            "mousemove",
            scratch
        );

        window.addEventListener(
            "mouseup",
            stopScratch
        );


        /* Touch */

        canvas.addEventListener(
            "touchstart",
            startScratch,
            { passive: false }
        );

        canvas.addEventListener(
            "touchmove",
            scratch,
            { passive: false }
        );

        canvas.addEventListener(
            "touchend",
            stopScratch
        );


        /* Initial canvas */

        setupCanvas();


        /* Resize */

        window.addEventListener(
            "resize",
            () => {

                /*
                 * Only recreate if the canvas
                 * has not been scratched yet.
                 */

                if (
                    canvas.style.pointerEvents !==
                    "none"
                ) {
                    setupCanvas();
                }

            }
        );

    });


    /* =========================
       MUSIC CONTROL
    ========================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState === "visible" &&
                !mainContent.classList.contains("hidden")
            ) {

                music.play().catch(() => {});

            }

        }
    );


    /* =========================
       SCROLL REVEAL
    ========================= */

    const cards =
        document.querySelectorAll(
            ".memory-card, .feedback-card"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    cards.forEach((card) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(40px)";

        card.style.transition =
            "opacity .8s ease, transform .8s ease";

        observer.observe(card);

    });

});
