document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       MEMORIES
    ========================================= */

    const memories = [
        {
            image: "photo1.jpg",
            title: "ஒரு அழகான நினைவு ❤️",
            message:
                "Akka & Mama... உங்கள் வாழ்க்கை முழுவதும் அன்பும் சந்தோஷமும் நிறைந்திருக்கட்டும். ❤️"
        },
        {
            image: "photo2.jpg",
            title: "இன்னொரு அழகான தருணம் 💕",
            message:
                "எத்தனை வருடங்கள் ஆனாலும் உங்கள் அன்பும் smile-உம் இப்படியே இருக்கட்டும். ❤️"
        },
        {
            image: "photo3.png",
            title: "Love + Friendship ❤️",
            message:
                "Husband & Wife-ஆக மட்டும் இல்லாமல், எப்போதும் best friends-ஆகவும் இருங்கள். ❤️"
        },
        {
            image: "photo4.jpg",
            title: "உங்கள் சந்தோஷம் 💖",
            message:
                "உங்கள் வீட்டில் சிரிப்பும், சந்தோஷமும், அன்பும் எப்போதும் நிறைந்திருக்கட்டும். ❤️"
        },
        {
            image: "photo5.jpg",
            title: "The Final Memory 💞",
            message:
                "இன்னும் பல வருடங்கள், பல Anniversary-கள், பல அழகான memories-ஐ இருவரும் சேர்ந்து உருவாக்குங்கள். ❤️"
        }
    ];


    /* =========================================
       VARIABLES
    ========================================= */

    let current = 0;
    let revealed = false;
    let scratching = false;

    let lastX = 0;
    let lastY = 0;

    let drawingFrame = null;
    let pendingPoint = null;

    let scratchCheckTimer = null;

    const BRUSH_SIZE = 58;
    const REVEAL_PERCENTAGE = 50;


    /* =========================================
       ELEMENTS
    ========================================= */

    const opening = document.getElementById("opening");
    const app = document.getElementById("app");

    const openGift = document.getElementById("openGift");
    const music = document.getElementById("bgMusic");

    const memoryImage = document.getElementById("memoryImage");
    const canvas = document.getElementById("scratchCanvas");

    const memoryNumber = document.getElementById("memoryNumber");
    const memoryTitle = document.getElementById("memoryTitle");

    const scratchText = document.getElementById("scratchText");

    const messageBox = document.getElementById("messageBox");
    const specialMessage = document.getElementById("specialMessage");
    const messageNumber = document.getElementById("messageNumber");

    const nextButton = document.getElementById("nextButton");

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    const finalPage = document.getElementById("finalPage");

    const emojiBubbles = document.getElementById("emojiBubbles");

    const ctx = canvas ? canvas.getContext("2d") : null;


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (!openGift) {
        console.error("Open Gift button not found!");
        return;
    }

    if (!app) {
        console.error("App not found!");
        return;
    }

    if (!canvas || !ctx) {
        console.error("Scratch canvas not found!");
        return;
    }


    /* =========================================
       DEVICE PIXEL RATIO
    ========================================= */

    function getDPR() {
        return Math.min(
            window.devicePixelRatio || 1,
            1.5
        );
    }


    /* =========================================
       OPEN GIFT
    ========================================= */

    openGift.addEventListener("click", () => {

        console.log("Gift button clicked!");

        opening.classList.add("hidden");
        app.classList.remove("hidden");

        /* MUSIC */

        if (music) {

            music.volume = 0.65;

            const playPromise = music.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {
                playPromise.catch(() => {
                    console.log("Music autoplay blocked.");
                });
            }
        }

        /* FIRST MEMORY */

        loadMemory(0);

    });


    /* =========================================
       LOAD MEMORY
    ========================================= */

    function loadMemory(index) {

        if (index < 0 || index >= memories.length) {
            return;
        }

        current = index;

        revealed = false;
        scratching = false;

        lastX = 0;
        lastY = 0;

        pendingPoint = null;

        if (drawingFrame !== null) {

            cancelAnimationFrame(drawingFrame);

            drawingFrame = null;
        }

        if (scratchCheckTimer) {

            clearTimeout(scratchCheckTimer);

            scratchCheckTimer = null;
        }


        const item = memories[index];


        /* MESSAGE */

        messageBox.classList.add("hidden");

        specialMessage.innerText = item.message;

        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");


        /* TITLE */

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(2, "0");

        memoryTitle.innerText = item.title;


        /* PROGRESS */

        progressText.innerText =
            `Memory ${index + 1} of ${memories.length}`;

        progressFill.style.width =
            `${((index + 1) / memories.length) * 100}%`;


        /* NEXT BUTTON */

        if (index === memories.length - 1) {

            nextButton.innerText =
                "❤️ Final Message";

        } else {

            nextButton.innerText =
                "Next Memory ❤️";
        }


        /* RESET SCRATCH UI */

        scratchText.style.display = "block";
        scratchText.style.opacity = "1";

        canvas.style.display = "block";
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";


        /* REMOVE OLD EMOJIS */

        if (emojiBubbles) {
            emojiBubbles.innerHTML = "";
        }


        /* LOAD IMAGE */

        memoryImage.onload = () => {

            requestAnimationFrame(() => {
                setupScratch();
            });

        };

        memoryImage.src = item.image;


        /* CACHE */

        if (memoryImage.complete) {

            requestAnimationFrame(() => {
                setupScratch();
            });
        }


        /* PRELOAD NEXT IMAGE */

        if (index < memories.length - 1) {

            const nextImage = new Image();

            nextImage.src =
                memories[index + 1].image;
        }

    }


    /* =========================================
       SETUP SCRATCH CANVAS
    ========================================= */

    function setupScratch() {

        const box = canvas.parentElement;

        if (!box) {
            return;
        }

        const rect = box.getBoundingClientRect();

        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        if (width <= 0 || height <= 0) {
            return;
        }

        const dpr = getDPR();


        /* CANVAS SIZE */

        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        /* TRANSFORM */

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        /* COVER */

        ctx.globalCompositeOperation =
            "source-over";


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                width,
                height
            );

        gradient.addColorStop(
            0,
            "#704252"
        );

        gradient.addColorStop(
            0.5,
            "#b58a9b"
        );

        gradient.addColorStop(
            1,
            "#633748"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* COVER TEXT */

        ctx.fillStyle =
            "rgba(255,255,255,0.25)";

        ctx.font =
            "bold 20px Arial";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            "✨ SCRATCH HERE ✨",
            width / 2,
            height / 2
        );


        /* ERASE MODE */

        ctx.globalCompositeOperation =
            "destination-out";

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

    }


    /* =========================================
       GET POINTER POSITION
    ========================================= */

    function getPosition(event) {

        const rect =
            canvas.getBoundingClientRect();

        return {

            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top

        };

    }


    /* =========================================
       DRAW SCRATCH
    ========================================= */

    function drawScratch(x, y) {

        if (revealed) {
            return;
        }


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();

        ctx.moveTo(
            lastX,
            lastY
        );

        ctx.lineTo(
            x,
            y
        );

        ctx.lineWidth =
            BRUSH_SIZE;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.stroke();


        /* ROUND BRUSH */

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            BRUSH_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        lastX = x;
        lastY = y;


        /* CHECK ACTUAL SCRATCH % */

        scheduleScratchCheck();

    }


    /* =========================================
       SCRATCH PERCENTAGE CHECK
    ========================================= */

    function scheduleScratchCheck() {

        if (scratchCheckTimer) {
            return;
        }

        scratchCheckTimer = setTimeout(() => {

            scratchCheckTimer = null;

            checkScratchPercentage();

        }, 120);

    }


    function checkScratchPercentage() {

        if (revealed) {
            return;
        }


        const width = canvas.width;
        const height = canvas.height;


        /*
         * Sample every 32nd byte.
         *
         * Alpha channel is every 4th byte.
         */

        const imageData =
            ctx.getImageData(
                0,
                0,
                width,
                height
            );


        let transparentPixels = 0;
        let sampledPixels = 0;


        /*
         * Every 8 pixels
         */

        for (
            let i = 3;
            i < imageData.data.length;
            i += 32
        ) {

            sampledPixels++;


            if (
                imageData.data[i] < 50
            ) {

                transparentPixels++;
            }
        }


        if (sampledPixels === 0) {
            return;
        }


        const percentage =
            (
                transparentPixels /
                sampledPixels
            ) * 100;


        console.log(
            "Scratch:",
            percentage.toFixed(1) + "%"
        );


        if (
            percentage >=
            REVEAL_PERCENTAGE
        ) {

            revealMessage();

        }

    }


    /* =========================================
       SCHEDULE SCRATCH
    ========================================= */

    function scheduleScratch(event) {

        if (
            revealed ||
            !scratching
        ) {
            return;
        }


        const pos =
            getPosition(event);


        pendingPoint = pos;


        if (drawingFrame !== null) {
            return;
        }


        drawingFrame =
            requestAnimationFrame(() => {

                drawingFrame = null;


                if (
                    !pendingPoint ||
                    revealed
                ) {
                    return;
                }


                const point =
                    pendingPoint;

                pendingPoint = null;


                drawScratch(
                    point.x,
                    point.y
                );

            });

    }


    /* =========================================
       POINTER DOWN
    ========================================= */

    canvas.addEventListener(
        "pointerdown",
        (event) => {

            if (revealed) {
                return;
            }


            event.preventDefault();

            scratching = true;


            const pos =
                getPosition(event);


            lastX = pos.x;
            lastY = pos.y;


            drawScratch(
                pos.x,
                pos.y
            );


            try {

                canvas.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {
                console.log(error);
            }

        }
    );


    /* =========================================
       POINTER MOVE
    ========================================= */

    canvas.addEventListener(
        "pointermove",
        (event) => {

            if (!scratching) {
                return;
            }


            event.preventDefault();

            scheduleScratch(event);

        }
    );


    /* =========================================
       POINTER UP
    ========================================= */

    canvas.addEventListener(
        "pointerup",
        (event) => {

            scratching = false;

            try {

                canvas.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {
                /* ignore */
            }

        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {

            scratching = false;

        }
    );


    /* =========================================
       REVEAL MESSAGE
    ========================================= */

    function revealMessage() {

        if (revealed) {
            return;
        }


        revealed = true;

        scratching = false;

        pendingPoint = null;


        if (scratchCheckTimer) {

            clearTimeout(
                scratchCheckTimer
            );

            scratchCheckTimer = null;
        }


        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;
        }


        /* FADE CANVAS */

        canvas.style.transition =
            "opacity 0.45s ease";

        canvas.style.opacity = "0";

        canvas.style.pointerEvents =
            "none";


        /* HIDE TEXT */

        scratchText.style.transition =
            "opacity 0.3s ease";

        scratchText.style.opacity = "0";


        /* EMOJIS */

        createEmojiBubbles();


        /* REMOVE CANVAS */

        setTimeout(() => {

            canvas.style.display =
                "none";

            scratchText.style.display =
                "none";

        }, 500);


        /* SHOW MESSAGE */

        setTimeout(() => {

            messageBox.classList.remove(
                "hidden"
            );


            messageBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 650);

    }


    /* =========================================
       EMOJI BUBBLES
    ========================================= */

    function createEmojiBubbles() {

        if (!emojiBubbles) {
            return;
        }


        emojiBubbles.innerHTML = "";


        const emojis = [
            "❤️",
            "💕",
            "💖",
            "💗",
            "💓",
            "💞",
            "💝",
            "💘",
            "🥰",
            "😍",
            "😘",
            "✨",
            "🌸",
            "💐",
            "🎉",
            "🥳",
            "💍",
            "🫶",
            "😊",
            "❤️",
            "💋",
            "🌹",
            "⭐",
            "🎊"
        ];


        /* MANY EMOJIS */

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const bubble =
                document.createElement("span");


            bubble.className =
                "emoji-bubble";


            bubble.innerText =
                emojis[
                    Math.floor(
                        Math.random() *
                        emojis.length
                    )
                ];


            bubble.style.left =
                Math.random() * 100 + "%";


            bubble.style.fontSize =
                (
                    20 +
                    Math.random() * 22
                ) + "px";


            bubble.style.animationDelay =
                Math.random() * 1.5 + "s";


            bubble.style.animationDuration =
                (
                    3 +
                    Math.random() * 2
                ) + "s";


            emojiBubbles.appendChild(
                bubble
            );

        }

    }


    /* =========================================
       NEXT BUTTON
    ========================================= */

    nextButton.addEventListener(
        "click",
        () => {

            console.log(
                "Next button clicked"
            );


            if (!revealed) {

                console.log(
                    "Memory not revealed yet."
                );

                return;
            }


            /* FINAL MEMORY */

            if (
                current ===
                memories.length - 1
            ) {

                app.classList.add(
                    "hidden"
                );

                finalPage.classList.remove(
                    "hidden"
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


                return;
            }


            /* NEXT MEMORY */

            loadMemory(
                current + 1
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =========================================
       RESIZE
    ========================================= */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    if (
                        !revealed &&
                        app &&
                        !app.classList.contains(
                            "hidden"
                        )
                    ) {

                        setupScratch();

                    }

                }, 250);

        }
    );


    /* =========================================
       START
    ========================================= */

    console.log(
        "Gift website loaded successfully ❤️"
    );

});
