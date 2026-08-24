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

    let scratchCount = 0;

    let lastX = 0;

    let lastY = 0;

    let drawingFrame = null;

    let pendingPoint = null;


    /*
     * Scratch amount.
     *
     * 35 strokes gives approximately
     * half-photo feel on mobile.
     */

    const REQUIRED_SCRATCHES = 35;

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

    const emojiBubbles =
        document.getElementById("emojiBubbles");


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (!openGift) {

        console.error(
            "Open Gift button not found."
        );

        return;
    }


    if (!canvas) {

        console.error(
            "Scratch canvas not found."
        );

        return;
    }


    if (!memoryImage) {

        console.error(
            "Memory image not found."
        );

        return;
    }


    /* =========================================
       DEVICE PIXEL RATIO
       CAPPED FOR PERFORMANCE
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

            opening.classList.add(
                "hidden"
            );

            app.classList.remove(
                "hidden"
            );


            /* ================================
               MUSIC
            ================================= */

            music.volume = 0.65;

            const playPromise =
                music.play();


            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(
                    (error) => {

                        console.log(
                            "Music could not start:",
                            error
                        );

                    }
                );

            }


            /* ================================
               FIRST MEMORY
            ================================= */

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

        scratchCount = 0;

        lastX = 0;

        lastY = 0;

        pendingPoint = null;


        /* ================================
           CANCEL OLD FRAME
        ================================= */

        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        const item =
            memories[index];


        /* ================================
           MESSAGE RESET
        ================================= */

        messageBox.classList.add(
            "hidden"
        );


        specialMessage.innerText =
            item.message;


        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(
                2,
                "0"
            );


        /* ================================
           TITLE
        ================================= */

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(
                2,
                "0"
            );


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
           NEXT BUTTON
        ================================= */

        if (
            index ===
            memories.length - 1
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
           CLEAR OLD EMOJIS
        ================================= */

        if (emojiBubbles) {

            emojiBubbles.innerHTML =
                "";

        }


        /* ================================
           LOAD PHOTO
        ================================= */

        memoryImage.onload =
            () => {

                requestAnimationFrame(
                    setupScratch
                );

            };


        memoryImage.src =
            item.image;


        /*
         * Browser cache case
         */

        if (
            memoryImage.complete
        ) {

            requestAnimationFrame(
                setupScratch
            );

        }


        /* ================================
           PRELOAD NEXT PHOTO
        ================================= */

        if (
            index <
            memories.length - 1
        ) {

            const nextImage =
                new Image();

            nextImage.src =
                memories[
                    index + 1
                ].image;

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
            getDPR();


        /* ================================
           CANVAS SIZE
        ================================= */

        canvas.width =
            Math.round(
                width * dpr
            );

        canvas.height =
            Math.round(
                height * dpr
            );


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        /* ================================
           RESET TRANSFORM
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
           COVER GRADIENT
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
           SCRATCH TEXT
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

    function drawScratch(
        x,
        y
    ) {

        if (revealed) {
            return;
        }


        ctx.globalCompositeOperation =
            "destination-out";


        /*
         * Smooth line
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
         * Round brush
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


        /*
         * Update position
         */

        lastX = x;

        lastY = y;


        /*
         * Count scratch strokes
         */

        scratchCount++;


        /*
         * Reveal around 50%
         */

        if (
            scratchCount >=
            REQUIRED_SCRATCHES
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


        /*
         * Already waiting for frame
         */

        if (
            drawingFrame !== null
        ) {

            return;

        }


        drawingFrame =
            requestAnimationFrame(
                () => {

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

                }
            );

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


            /*
             * Keep pointer captured
             */

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


    /* =========================================
       POINTER CANCEL
    ========================================= */

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


        /*
         * IMPORTANT
         *
         * Next button works only after
         * this becomes true.
         */

        revealed = true;

        scratching = false;

        pendingPoint = null;


        /* ================================
           CANCEL DRAWING FRAME
        ================================= */

        if (drawingFrame !== null) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        /* ================================
           FADE REMAINING COVER
        ================================= */

        canvas.style.transition =
            "opacity 0.45s ease";


        canvas.style.opacity =
            "0";


        /* ================================
           HIDE SCRATCH TEXT
        ================================= */

        scratchText.style.transition =
            "opacity 0.3s ease";


        scratchText.style.opacity =
            "0";


        /* ================================
           DISABLE CANVAS
        ================================= */

        canvas.style.pointerEvents =
            "none";


        /* ================================
           EMOJI CELEBRATION
        ================================= */

        createEmojiBubbles();


        /* ================================
           REMOVE CANVAS
        ================================= */

        setTimeout(
            () => {

                canvas.style.display =
                    "none";

                scratchText.style.display =
                    "none";

            },
            500
        );


        /* ================================
           SHOW MESSAGE
        ================================= */

        setTimeout(
            () => {

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

        if (!emojiBubbles) {
            return;
        }


        /*
         * Clear previous bubbles
         */

        emojiBubbles.innerHTML =
            "";


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
            "❤️"

        ];


        /*
         * Create 24 bubbles
         */

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const bubble =
                document.createElement(
                    "span"
                );


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
             * Random horizontal position
             */

            bubble.style.left =
                Math.random() *
                100 +
                "%";


            /*
             * Random delay
             */

            bubble.style.animationDelay =
                Math.random() *
                1.2 +
                "s";


            /*
             * Random size
            
