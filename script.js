document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       MEMORIES
    ========================================= */

    const memories = [

        {
            image: "photo1.jpg",

            title:
                "ஒரு அழகான நினைவு ❤️",

            message:
                "Akka & Mama... உங்கள் வாழ்க்கை முழுவதும் அன்பும் சந்தோஷமும் நிறைந்திருக்கட்டும். ❤️"
        },

        {
            image: "photo2.jpg",

            title:
                "இன்னொரு அழகான தருணம் 💕",

            message:
                "எத்தனை வருடங்கள் ஆனாலும் உங்கள் அன்பும் smile-உம் இப்படியே இருக்கட்டும். ❤️"
        },

        {
            image: "photo3.png",

            title:
                "Love + Friendship ❤️",

            message:
                "Husband & Wife-ஆக மட்டும் இல்லாமல், எப்போதும் best friends-ஆகவும் இருங்கள். ❤️"
        },

        {
            image: "photo4.jpg",

            title:
                "உங்கள் சந்தோஷம் 💖",

            message:
                "உங்கள் வீட்டில் சிரிப்பும், சந்தோஷமும், அன்பும் எப்போதும் நிறைந்திருக்கட்டும். ❤️"
        },

        {
            image: "photo5.jpg",

            title:
                "The Final Memory 💞",

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

    let percentageTimer = null;


    /*
     * Actual scratch percentage.
     */

    const REQUIRED_PERCENTAGE = 50;


    /*
     * Brush size.
     */

    const BRUSH_SIZE = 52;


    /* =========================================
       ELEMENTS
    ========================================= */

    const opening =
        document.getElementById("opening");

    const app =
        document.getElementById("app");

    const openGift =
        document.getElementById("openGift");

    const music =
        document.getElementById("bgMusic");

    const memoryPage =
        document.getElementById("memoryPage");

    const memoryImage =
        document.getElementById("memoryImage");

    const canvas =
        document.getElementById("scratchCanvas");

    const ctx =
        canvas.getContext("2d", {
            willReadFrequently: true
        });

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

    const emojiBubbles =
        document.getElementById("emojiBubbles");


    /* =========================================
       DPR
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

    openGift.addEventListener(
        "click",
        () => {

            opening.classList.add("hidden");

            app.classList.remove("hidden");


            /*
             * Music
             */

            music.volume = 0.65;

            const playPromise =
                music.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {});

            }


            loadMemory(0);

        }
    );


    /* =========================================
       LOAD MEMORY
    ========================================= */

    function loadMemory(index) {

        current = index;

        revealed = false;

        scratching = false;

        lastX = 0;

        lastY = 0;

        pendingPoint = null;


        /*
         * Stop percentage checker.
         */

        if (percentageTimer !== null) {

            clearTimeout(percentageTimer);

            percentageTimer = null;

        }


        /*
         * Cancel animation.
         */

        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        const item =
            memories[index];


        /* ================================
           RESET MESSAGE
        ================================= */

        messageBox.classList.add("hidden");

        specialMessage.innerText =
            item.message;

        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");


        /* ================================
           TITLE
        ================================= */

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(2, "0");

        memoryTitle.innerText =
            item.title;


        /* ================================
           PROGRESS
        ================================= */

        progressText.innerText =
            `Memory ${index + 1} of ${memories.length}`;

        progressFill.style.width =
            `${((index + 1) / memories.length) * 100}%`;


        /* ================================
           BUTTON
        ================================= */

        if (
            index === memories.length - 1
        ) {

            nextButton.innerText =
                "❤️ Final Message";

        } else {

            nextButton.innerText =
                "Next Memory ❤️";

        }


        /* ================================
           RESET SCRATCH UI
        ================================= */

        scratchText.style.display =
            "block";

        scratchText.style.opacity =
            "1";

        scratchText.style.transition =
            "none";


        canvas.style.display =
            "block";

        canvas.style.opacity =
            "1";

        canvas.style.transition =
            "none";

        canvas.style.pointerEvents =
            "auto";


        /* ================================
           CLEAR EMOJIS
        ================================= */

        emojiBubbles.innerHTML = "";


        /* ================================
           LOAD IMAGE
        ================================= */

        memoryImage.onload = () => {

            requestAnimationFrame(
                setupScratch
            );

        };


        memoryImage.src =
            item.image;


        /*
         * Cached image.
         */

        if (memoryImage.complete) {

            requestAnimationFrame(
                setupScratch
            );

        }


        /* ================================
           PRELOAD NEXT
        ================================= */

        if (
            index <
            memories.length - 1
        ) {

            const nextImage =
                new Image();

            nextImage.src =
                memories[index + 1].image;

        }

    }


    /* =========================================
       SETUP SCRATCH
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
            getDPR();


        /* ================================
           CANVAS SIZE
        ================================= */

        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        /* ================================
           SCALE
        ================================= */

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        ctx.globalCompositeOperation =
            "source-over";


        /* ================================
           COVER
        ================================= */

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


        /* ================================
           COVER TEXT
        ================================= */

        ctx.fillStyle =
            "rgba(255,255,255,0.25)";

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


        /* ================================
           ERASE MODE
        ================================= */

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
       DRAW SCRATCH
    ========================================= */

    function drawScratch(x, y) {

        if (revealed) {
            return;
        }


        ctx.globalCompositeOperation =
            "destination-out";


        /*
         * Line
         */

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


        /*
         * Brush circle
         */

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


        /*
         * Check percentage.
         */

        schedulePercentageCheck();

    }


    /* =========================================
       SCHEDULE PERCENTAGE CHECK
    ========================================= */

    function schedulePercentageCheck() {

        if (revealed) {
            return;
        }


        /*
         * Don't check canvas on every
         * pointer movement.
         */

        if (percentageTimer !== null) {
            return;
        }


        percentageTimer =
            setTimeout(() => {

                percentageTimer = null;

                checkScratchPercentage();

            }, 300);

    }


    /* =========================================
       CHECK ACTUAL SCRATCH %
    ========================================= */

    function checkScratchPercentage() {

        if (revealed) {
            return;
        }


        const width =
            canvas.width;

        const height =
            canvas.height;


        /*
         * Sample every 8th pixel.
         *
         * This keeps mobile performance good.
         */

        const imageData =
            ctx.getImageData(
                0,
                0,
                width,
                height
            );


        const data =
            imageData.data;


        let transparentPixels = 0;

        let sampledPixels = 0;


        /*
         * RGBA = 4 values.
         *
         * Every 8th pixel.
         */

        const pixelStep = 8;


        for (
            let pixel = 0;
            pixel < width * height;
            pixel += pixelStep
        ) {

            const alphaIndex =
                pixel * 4 + 3;


            sampledPixels++;


            if (
                data[alphaIndex] < 50
            ) {

                transparentPixels++;

            }

        }


        const percentage =
            (
                transparentPixels /
                sampledPixels
            ) * 100;


        /*
         * 50% reached.
         */

        if (
            percentage >=
            REQUIRED_PERCENTAGE
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


        pendingPoint =
            pos;


        if (
            drawingFrame !== null
        ) {

            return;

        }


        drawingFrame =
            requestAnimationFrame(() => {

                drawingFrame =
                    null;


                if (
                    !pendingPoint ||
                    revealed
                ) {

                    return;

                }


                const point =
                    pendingPoint;


                pendingPoint =
                    null;


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

                /* Ignore */

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


            scheduleScratch(
                event
            );

        }
    );


    /* =========================================
       POINTER UP
    ========================================= */

    canvas.addEventListener(
        "pointerup",
        () => {

            scratching = false;

        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {

            scratching = false;

        }
    );


    /* =========================================
       REVEAL
    ========================================= */

    function revealMessage() {

        if (revealed) {
            return;
        }


        revealed = true;

        scratching = false;

        pendingPoint = null;


        /*
         * Stop percentage check.
         */

        if (percentageTimer !== null) {

            clearTimeout(
                percentageTimer
            );

            percentageTimer = null;

        }


        /*
         * Cancel animation.
         */

        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        /* ================================
           EMOJI
        ================================= */

        createEmojiBubbles();


        /* ================================
           FADE SCRATCH COVER
        ================================= */

        canvas.style.transition =
            "opacity 0.6s ease";

        canvas.style.opacity =
            "0";


        /* ================================
           HIDE TEXT
        ================================= */

        scratchText.style.transition =
            "opacity 0.35s ease";

        scratchText.style.opacity =
            "0";


        /*
         * Disable canvas.
         */

        canvas.style.pointerEvents =
            "none";


        /* ================================
           REMOVE SCRATCH LAYER
        ================================= */

        setTimeout(() => {

            canvas.style.display =
                "none";

            scratchText.style.display =
                "none";

        }, 650);


        /* ================================
           MESSAGE
        ================================= */

        setTimeout(() => {

            messageBox.classList.remove(
                "hidden"
            );


            messageBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        }, 750);

    }


    /* =========================================
       EMOJI BUBBLES
    ========================================= */

    function createEmojiBubbles() {

        emojiBubbles.innerHTML = "";


        const emojis = [

            "❤️",
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
            "✨",
            "🌸",
            "💐",
            "🎉",
            "🥳",
            "💍",
            "🫶",
            "😊",
            "❤️",
            "💕",
            "💖",
            "🥰",
            "✨",
            "🌹",
            "💗",
            "💞",
            "🎊"

        ];


        /*
         * 30 emojis.
         */

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


            /*
             * Random position.
             */

            bubble.style.left =
                (
                    Math.random() * 96
                ) + "%";


            /*
             * Random size.
             */

            const s
