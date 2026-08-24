document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       DATA
    ===================================== */

    const memories = [

        {
            image: "photos/photo1.jpg",

            title: "ஒரு அழகான நினைவு ❤️",

            message:
                `Akka & Mama...

இந்த photo-வை பார்க்கும்போது,
உங்கள் வாழ்க்கையில் எப்போதும்
இப்படியே சந்தோஷமும் அன்பும்
நிறைந்திருக்கணும் என்று
மனசார wish பண்றேன். ❤️`
        },

        {
            image: "photos/photo2.jpg",

            title: "இன்னொரு அழகான தருணம் 💕",

            message:
                `எத்தனை வருடங்கள் ஆனாலும்,
இந்த smile-ம் இந்த love-ம்
ஒருபோதும் குறையாமல் இருக்கணும்.

Happy Married Life
Akka & Mama! ❤️`
        },

        {
            image: "photos/photo3.jpg",

            title: "Love + Friendship ❤️",

            message:
                `Husband & Wife-ஆக மட்டும் இல்லாமல்,

ஒருவருக்கு ஒருவர் best friends-ஆகவும்
எப்போதும் இருக்கணும்.

சின்ன misunderstandings வந்தாலும்
பெரிய அன்பால் அதை கடந்து செல்லணும். ❤️`
        },

        {
            image: "photos/photo4.jpg",

            title: "உங்கள் சந்தோஷம் 💖",

            message:
                `உங்கள் வாழ்க்கையில் வரும்
ஒவ்வொரு நாளும் இன்னொரு
அழகான memory-யாக மாறணும்.

உங்கள் வீட்டில் சிரிப்பும்,
சந்தோஷமும், அன்பும் எப்போதும்
நிறைந்திருக்கட்டும். ❤️`
        },

        {
            image: "photos/photo5.jpg",

            title: "The Final Memory 💞",

            message:
                `இது ஒரு photo மட்டும் இல்ல...

உங்கள் வாழ்க்கையின் இன்னொரு
அழகான நினைவு.

இன்னும் பல வருடங்கள்,
பல Anniversary-கள்,
பல சந்தோஷமான memories-ஐ
இருவரும் சேர்ந்து உருவாக்கணும்.

இப்படியே என்றும்
சந்தோஷமாக வாழணும். ❤️`
        }

    ];


    /* =====================================
       ELEMENTS
    ===================================== */

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

    const memoryNumber =
        document.getElementById("memoryNumber");

    const memoryTitle =
        document.getElementById("memoryTitle");

    const memoryImage =
        document.getElementById("memoryImage");

    const canvas =
        document.getElementById("scratchCanvas");

    const scratchText =
        document.getElementById("scratchText");

    const messageBox =
        document.getElementById("messageBox");

    const messageNumber =
        document.getElementById("messageNumber");

    const specialMessage =
        document.getElementById("specialMessage");

    const nextButton =
        document.getElementById("nextButton");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    const finalPage =
        document.getElementById("finalPage");

    const feedbackButton =
        document.getElementById("feedbackButton");

    const feedbackPage =
        document.getElementById("feedbackPage");

    const typing =
        document.getElementById("typing");

    const feedbackText =
        document.getElementById("feedbackText");


    /* =====================================
       STATE
    ===================================== */

    let currentIndex = 0;

    let isDrawing = false;

    let revealed = false;

    let ctx;


    /* =====================================
       OPEN GIFT
    ===================================== */

    openGift.addEventListener("click", async function () {

        opening.classList.add("hidden");

        app.classList.remove("hidden");

        /*
         * Music starts ONLY after
         * user's button click.
         */

        try {

            music.volume = 0.7;

            await music.play();

        } catch (error) {

            console.log(
                "Audio error:",
                error
            );

            /*
             * If browser blocks it,
             * user can tap screen again.
             */

        }

        loadMemory(0);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =====================================
       LOAD MEMORY
    ===================================== */

    function loadMemory(index) {

        currentIndex = index;

        revealed = false;

        isDrawing = false;

        const memory =
            memories[index];


        memoryNumber.textContent =
            `MEMORY ${String(index + 1).padStart(2, "0")}`;


        memoryTitle.textContent =
            memory.title;


        memoryImage.src =
            memory.image;


        messageNumber.textContent =
            `SPECIAL MESSAGE ${String(index + 1).padStart(2, "0")}`;


        specialMessage.textContent =
            memory.message;


        messageBox.classList.add("hidden");


        scratchText.style.display =
            "block";


        canvas.style.pointerEvents =
            "auto";


        progressText.textContent =
            `Memory ${index + 1} of 5`;


        progressFill.style.width =
            `${((index + 1) / 5) * 100}%`;


        /*
         * Change Next button
         */

        if (index === memories.length - 1) {

            nextButton.textContent =
                "❤️ Final Message";

        } else {

            nextButton.textContent =
                "Next Memory ❤️";

        }


        /*
         * Setup scratch canvas
         * after image/container renders.
         */

        requestAnimationFrame(
            setupCanvas
        );

    }


    /* =====================================
       CANVAS SETUP
    ===================================== */

    function setupCanvas() {

        const rect =
            canvas.getBoundingClientRect();


        if (
            rect.width === 0 ||
            rect.height === 0
        ) {
            return;
        }


        const dpr =
            window.devicePixelRatio || 1;


        canvas.width =
            Math.floor(
                rect.width * dpr
            );


        canvas.height =
            Math.floor(
                rect.height * dpr
            );


        ctx =
            canvas.getContext("2d");


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        /*
         * Scratch cover
         */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                rect.width,
                rect.height
            );


        gradient.addColorStop(
            0,
            "#674553"
        );


        gradient.addColorStop(
            0.5,
            "#c59aaa"
        );


        gradient.addColorStop(
            1,
            "#60404e"
        );


        ctx.globalCompositeOperation =
            "source-over";


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            rect.width,
            rect.height
        );


        /*
         * Small texture
         */

        for (
            let i = 0;
            i < 500;
            i++
        ) {

            const x =
                Math.random() * rect.width;

            const y =
                Math.random() * rect.height;


            ctx.fillStyle =
                "rgba(255,255,255,.08)";


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

    }


    /* =====================================
       POINTER POSITION
    ===================================== */

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


    /* =====================================
       START SCRATCH
    ===================================== */

    function startScratch(event) {

        if (
            revealed ||
            !ctx
        ) {
            return;
        }


        isDrawing = true;


        const position =
            getPosition(event);


        scratch(
            position.x,
            position.y
        );


        event.preventDefault();

    }


    /* =====================================
       SCRATCH
    ===================================== */

    function moveScratch(event) {

        if (
            !isDrawing ||
            revealed ||
            !ctx
        ) {
            return;
        }


        const position =
            getPosition(event);


        scratch(
            position.x,
            position.y
        );


        event.preventDefault();

    }


    function scratch(x, y) {

        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            28,
            0,
            Math.PI * 2
        );


        ctx.fill();


        checkScratch();

    }


    /* =====================================
       STOP
    ===================================== */

    function stopScratch() {

        isDrawing = false;

    }


    /* =====================================
       CHECK SCRATCH %
    ===================================== */

    function checkScratch() {

        if (!ctx || revealed) {
            return;
        }


        /*
         * Sample canvas pixels.
         */

        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        let transparent = 0;

        let total = 0;


        /*
         * Check every 16th pixel
         * for better mobile performance.
         */

        for (
            let i = 3;
            i < imageData.data.length;
            i += 16
        ) {

            total++;


            if (
                imageData.data[i] < 50
            ) {

                transparent++;

            }

        }


        const percentage =
            transparent / total * 100;


        /*
         * 45% scratched
         */

        if (
            percentage >= 45
        ) {

            revealPhoto();

        }

    }


    /* =====================================
       REVEAL PHOTO
    ===================================== */

    function revealPhoto() {

        if (revealed) {
            return;
        }


        revealed = true;


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.style.pointerEvents =
            "none";


        scratchText.style.display =
            "none";


        /*
         * Show special message
         */

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
            500
        );

    }


    /* =====================================
       NEXT BUTTON
    ===================================== */

    nextButton.addEventListener(
        "click",
        function () {

            if (!revealed) {
                return;
            }


            /*
             * If last photo
             */

            if (
                currentIndex ===
                memories.length - 1
            ) {

                showFinal();

                return;

            }


            loadMemory(
                currentIndex + 1
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =====================================
       FINAL PAGE
    ===================================== */

    function showFinal() {

        memoryPage.classList.add(
            "hidden"
        );


        document
            .querySelector(".progress-area")
            .classList.add("hidden");


        document
            .querySelector(".top")
            .classList.add("hidden");


        finalPage.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================
       AKKA FEEDBACK
    ===================================== */

    feedbackButton.addEventListener(
        "click",
        function () {

            finalPage.classList.add(
                "hidden"
            );


            feedbackPage.classList.remove(
                "hidden"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            startFeedback();

        }
    );


    let feedbackStarted =
        false;


    function startFeedback() {

        if (feedbackStarted) {
            return;
        }


        feedbackStarted = true;


        typing.textContent =
            "Akka is typing...";


        feedbackText.classList.remove(
            "show"
        );


        /*
         * After 2.5 seconds
         */

        setTimeout(
            function () {

                typing.textContent =
                    "Akka ❤️";


                feedbackText.classList.add(
                    "show"
                );

            },
            2500
        );

    }


    /* =====================================
       MOUSE EVENTS
    ===================================== */

    canvas.addEventListener(
        "pointerdown",
        startScratch
    );


    canvas.addEventListener(
        "pointermove",
        moveScratch
    );


    canvas.addEventListener(
        "pointerup",
        stopScratch
    );


    canvas.addEventListener(
        "pointercancel",
        stopScratch
    );


    canvas.addEventListener(
        "pointerleave",
        stopScratch
    );


    /* =====================================
       RESIZE
    ===================================== */

    window.addEventListener(
        "resize",
        function () {

            /*
             * Don't reset canvas
             * after photo is revealed.
             */

            if (!revealed) {

                setupCanvas();

            }

        }
    );


    /* =====================================
       PREVENT IMAGE DRAG
    ===================================== */

    memoryImage.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        }
    );


});
