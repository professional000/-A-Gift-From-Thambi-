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

    const REQUIRED_SCRATCHES = 45;
    const BRUSH_SIZE = 46;
    const emojiBubbles =
    document.getElementById("emojiBubbles");


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
        canvas.getContext("2d", {
            alpha: true
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


    /* =========================================
       SAFETY CHECK
    ========================================= */

    if (
        !openGift ||
        !app ||
        !memoryImage ||
        !canvas
    ) {
        console.error(
            "Required website elements are missing."
        );
        return;
    }


    /* =========================================
       DEVICE PIXEL RATIO
       CAPPED FOR MOBILE PERFORMANCE
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

        opening.classList.add("hidden");
        app.classList.remove("hidden");


        /* MUSIC */

        music.volume = 0.65;

        const playPromise =
            music.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(() => {
                console.log(
                    "Music playback was blocked."
                );
            });

        }


        loadMemory(0);

    });


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


        if (drawingFrame) {

            cancelAnimationFrame(
                drawingFrame
            );

            drawingFrame = null;

        }


        const item =
            memories[index];


        /* MESSAGE */

        messageBox.classList.add(
            "hidden"
        );


        specialMessage.innerText =
            item.message;


        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");


        /* TITLE */

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(2, "0");


        memoryTitle.innerText =
            item.title;


        /* PROGRESS */

        progressText.innerText =
            `Memory ${index + 1} of ${memories.length}`;


        progressFill.style.width =
            `${((index + 1) / memories.length) * 100}%`;


        /* NEXT BUTTON */

        nextButton.innerText =
            index === memories.length - 1
                ? "❤️ Final Message"
                : "Next Memory ❤️";


        /* RESET SCRATCH UI */

        scratchText.style.display =
            "block";

        canvas.style.display =
            "block";

        canvas.style.pointerEvents =
            "auto";


        /*
         * Remove old image handler
         */

        memoryImage.onload = null;


        /*
         * Load image
         */

        memoryImage.src =
            item.image;


        /*
         * Setup after image is ready
         */

        if (memoryImage.complete) {

            requestAnimationFrame(
                setupScratch
            );

        } else {

            memoryImage.onload =
                () => {

                    requestAnimationFrame(
                        setupScratch
                    );

                };

        }


        /*
         * Preload ONLY next image.
         * This avoids loading all photos at once.
         */

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


        /*
         * Physical canvas size
         */

        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        /*
         * Reset canvas transform
         */

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


        /*
         * Scratch cover gradient
         */

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


        /*
         * Scratch label
         */

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


        /*
         * Eraser mode
         */

        ctx.globalCompositeOperation =
            "destination-out";


        /*
         * Brush settings
         */

        ctx.lineCap = "round";
        ctx.lineJoin = "round";


    }


    /* =========================================
       POINTER POSITION
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

        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        /*
         * Connect previous point
         * to current point.
         *
         * This creates smooth scratching
         * with fewer canvas operations.
         */

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


        ctx.stroke();


        /*
         * First point
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


        scratchCount++;


        if (
            scratchCount >=
            REQUIRED_SCRATCHES
        ) {

            revealMessage();

        }

    }


    /* =========================================
       SCHEDULE SCRATCH
       requestAnimationFrame prevents
       too many canvas drawings.
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


            scheduleScratch(event);

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


    canvas.addEventListener(
        "pointerleave",
        () => {

            /*
             * Do not force stop here.
             * Pointer capture handles touch.
             */

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


    if (drawingFrame) {

        cancelAnimationFrame(
            drawingFrame
        );

        drawingFrame = null;

    }


    pendingPoint = null;


    /*
     * Smoothly clear remaining scratch cover
     */

    canvas.style.transition =
        "opacity 0.45s ease";

    canvas.style.opacity = "0";


    /*
     * Hide scratch instruction
     */

    scratchText.style.transition =
        "opacity 0.3s ease";

    scratchText.style.opacity = "0";


    /*
     * Emoji celebration
     */

    createEmojiBubbles();


    /*
     * Remove canvas completely
     */

    setTimeout(() => {

        canvas.style.display =
            "none";

        scratchText.style.display =
            "none";

    }, 500);


    /*
     * Show special message
     */

    setTimeout(() => {

        messageBox.classList.remove(
            "hidden"
        );


        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 700);

    }

    function createEmojiBubbles() {

    if (!emojiBubbles) {
        return;
    }


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
     * Clear old bubbles
     */

    emojiBubbles.innerHTML = "";


    /*
     * Create many bubbles
     */

    for (
        let i = 0;
        i < 22;
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
         * Random horizontal position
         */

        bubble.style.left =
            Math.random() * 100 + "%";


        /*
         * Random animation delay
         */

        bubble.style.animationDelay =
            Math.random() * 1.2 + "s";


        /*
         * Random size
         */

        const size =
            18 +
            Math.random() * 22;


        bubble.style.fontSize =
            size + "px";


        /*
         * Random animation duration
         */

        bubble.style.animationDuration =
            3 +
            Math.random() * 2 +
            "s";


        emojiBubbles.appendChild(
            bubble
        );

    }


    /*
     * Remove after animation
     */

    setTimeout(() => {

        emojiBubbles.innerHTML = "";

    }, 6000);

    }


    /* =========================================
       FINAL MESSAGE
    ========================================= */

    function showFinal() {

        const top =
            document.querySelector(".top");

        const progress =
            document.querySelector(
                ".progress-area"
            );

        const memory =
            document.querySelector(
                ".memory-page"
            );


        if (top) {
            top.classList.add("hidden");
        }


        if (progress) {
            progress.classList.add("hidden");
        }


        if (memory) {
            memory.classList.add("hidden");
        }


        finalPage.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =========================================
       RESIZE
       Debounced to avoid repeated canvas
       rebuilding while browser is resizing.
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
                        !app.classList.contains(
                            "hidden"
                        ) &&
                        !revealed
                    ) {

                        setupScratch();

                    }

                }, 150);

        },
        {
            passive: true
        }
    );


    /* =========================================
       START
    ========================================= */

    console.log(
        "Optimized website JavaScript loaded."
    );

});
