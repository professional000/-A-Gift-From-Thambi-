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
       ELEMENTS
    ========================================= */

    const opening = document.getElementById("opening");
    const app = document.getElementById("app");
    const openGift = document.getElementById("openGift");
    const music = document.getElementById("bgMusic");

    const memoryImage =
        document.getElementById("memoryImage");

    const canvas =
        document.getElementById("scratchCanvas");

    const ctx =
        canvas.getContext("2d");

    const memoryNumber =
        document.getElementById("memoryNumber");

    const memoryTitle =
        document.getElementById("memoryTitle");

    const scratchText =
        document.getElementById("scratchText");

    const messageBox =
        document.getElementById("messageBox");

    const specialMessage =
        document.getElementById("specialMessage");

    const messageNumber =
        document.getElementById("messageNumber");

    const nextButton =
        document.getElementById("nextButton");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    const finalPage =
        document.getElementById("finalPage");

    const memoryPage =
        document.getElementById("memoryPage");

    const emojiBubbles =
        document.getElementById("emojiBubbles");


    /* =========================================
       CHECK
    ========================================= */

    if (!openGift) {
        console.error("Open Your Gift button not found!");
        return;
    }

    if (!canvas || !ctx) {
        console.error("Scratch canvas not found!");
        return;
    }


    /* =========================================
       STATE
    ========================================= */

    let currentMemory = 0;
    let revealed = false;
    let scratching = false;

    let lastX = 0;
    let lastY = 0;

    let scratchDistance = 0;
    let drawingFrame = null;
    let pendingPoint = null;


    /* =========================================
       SETTINGS
    ========================================= */

    const REVEAL_PERCENTAGE = 50;
    const BRUSH_SIZE = 55;


    /* =========================================
       OPEN GIFT BUTTON
    ========================================= */

    openGift.addEventListener("click", function () {

        console.log("🎁 Open Your Gift clicked");

        /* Hide opening screen */
        opening.classList.add("hidden");

        /* Show main app */
        app.classList.remove("hidden");

        /* Start music */
        if (music) {

            music.volume = 0.65;

            const playPromise = music.play();

            if (playPromise !== undefined) {

                playPromise.catch(() => {
                    console.log(
                        "Music autoplay/playback was blocked."
                    );
                });

            }
        }

        /* Load first memory */
        loadMemory(0);

        /* Scroll top */
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =========================================
       LOAD MEMORY
    ========================================= */

    function loadMemory(index) {

        if (
            index < 0 ||
            index >= memories.length
        ) {
            return;
        }

        currentMemory = index;
        revealed = false;
        scratching = false;

        lastX = 0;
        lastY = 0;
        scratchDistance = 0;
        pendingPoint = null;


        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;
        }


        const memory = memories[index];


        /* Message */

        messageBox.classList.add("hidden");

        specialMessage.textContent =
            memory.message;

        messageNumber.textContent =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");


        /* Title */

        memoryNumber.textContent =
            "MEMORY " +
            String(index + 1).padStart(2, "0");

        memoryTitle.textContent =
            memory.title;


        /* Progress */

        progressText.textContent =
            `Memory ${index + 1} of ${memories.length}`;

        progressFill.style.width =
            `${((index + 1) / memories.length) * 100}%`;


        /* Next button */

        if (
            index === memories.length - 1
        ) {

            nextButton.textContent =
                "❤️ Final Message";

        } else {

            nextButton.textContent =
                "Next Memory ❤️";

        }


        /* Reset scratch */

        scratchText.style.display = "block";
        scratchText.style.opacity = "1";

        canvas.style.display = "block";
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";


        /* Clear emoji */

        emojiBubbles.innerHTML = "";


        /* Load image */

        memoryImage.onload = function () {

            requestAnimationFrame(() => {
                setupScratch();
            });

        };

        memoryImage.src = memory.image;


        /* Cached image */

        if (memoryImage.complete) {

            requestAnimationFrame(() => {
                setupScratch();
            });

        }


        /* Preload next image */

        if (
            index < memories.length - 1
        ) {

            const preload = new Image();

            preload.src =
                memories[index + 1].image;

        }

    }


    /* =========================================
       SETUP SCRATCH CANVAS
    ========================================= */

    function setupScratch() {

        const box =
            canvas.parentElement;

        if (!box) {
            return;
        }

        const rect =
            box.getBoundingClientRect();

        const width =
            Math.round(rect.width);

        const height =
            Math.round(rect.height);

        if (
            width <= 0 ||
            height <= 0
        ) {
            return;
        }


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                1.5
            );


        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);

        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        /* Cover */

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


        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /* Scratch text */

        ctx.fillStyle =
            "rgba(255,255,255,0.28)";

        ctx.font =
            "bold 20px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "✨ SCRATCH HERE ✨",
            width / 2,
            height / 2
        );


        /* Eraser */

        ctx.globalCompositeOperation =
            "destination-out";

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";

    }


    /* =========================================
       GET POSITION
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
       SCRATCH
    ========================================= */

    function drawScratch(x, y) {

        if (revealed) {
            return;
        }


        ctx.globalCompositeOperation =
            "destination-out";


        /* Line */

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

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";

        ctx.stroke();


        /* Brush circle */

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            BRUSH_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* Distance */

        const dx =
            x - lastX;

        const dy =
            y - lastY;

        scratchDistance +=
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        lastX = x;
        lastY = y;


        /* Check */

        if (
            scratchDistance >= 180
        ) {

            checkScratchPercentage();

        }

    }


    /* =========================================
       CHECK SCRATCH %
    ========================================= */

    function checkScratchPercentage() {

        if (revealed) {
            return;
        }


        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

        const data =
            imageData.data;


        let transparent = 0;
        let total = 0;


        for (
            let i = 3;
            i < data.length;
            i += 32
        ) {

            total++;

            if (
                data[i] < 50
            ) {

                transparent++;

            }

        }


        if (!total) {
            return;
        }


        const percentage =
            (
                transparent /
                total
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
       POINTER DOWN
    ========================================= */

    canvas.addEventListener(
        "pointerdown",
        function (event) {

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
        function (event) {

            if (
                !scratching ||
                revealed
            ) {
                return;
            }

            event.preventDefault();

            pendingPoint =
                getPosition(event);


            if (
                drawingFrame !== null
            ) {
                return;
            }


            drawingFrame =
                requestAnimationFrame(
                    function () {

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

                    }
                );

        }
    );


    /* =========================================
       POINTER UP
    ========================================= */

    canvas.addEventListener(
        "pointerup",
        function (event) {

            scratching = false;

            try {

                canvas.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {

                /* Ignore */

            }

        }
    );


    canvas.addEventListener(
        "pointercancel",
        function () {

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


        if (
            drawingFrame !== null
        ) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        /* Hide scratch cover */

        canvas.style.transition =
            "opacity 0.5s ease";

        canvas.style.opacity =
            "0";

        canvas.style.pointerEvents =
            "none";


        /* Hide scratch text */

        scratchText.style.transition =
            "opacity 0.3s ease";

        scratchText.style.opacity =
            "0";


        /* Emojis */

        createEmojiBubbles();


        /* Remove canvas */

        setTimeout(
            function () {

                canvas.style.display =
                    "none";

                scratchText.style.display =
                    "none";

            },
            500
        );


        /* Show message */

        setTimeout(
            function () {

                messageBox.classList.remove(
                    "hidden"
                );


                messageBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            700
        );

    }


    /* =========================================
       EMOJI BUBBLES
    ========================================= */

    function createEmojiBubbles() {

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
            "🫶"
        ];


        for (
            let i = 0;
            i < 25;
            i++
        ) {

            const bubble =
                document.createElement("div");

            bubble.className =
                "emoji-bubble";

            bubble.textContent =
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
                    18 +
                    Math.random() * 20
                ) + "px";


            bubble.style.animationDelay =
                (
                    Math.random() * 1.5
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
        function () {

            if (
                currentMemory <
                memories.length - 1
            ) {

                loadMemory(
                    currentMemory + 1
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                /* Show final page */

                memoryPage.classList.add(
                    "hidden"
                );

                finalPage.classList.remove(
                    "hidden"
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    /* =========================================
       WINDOW RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                !app.classList.contains("hidden") &&
                !revealed
            ) {

                setupScratch();

            }

        }
    );

});
