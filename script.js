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

    let scratching = false;

    let revealed = false;

    let scratchCount = 0;


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


    /* =========================================
       CHECK ELEMENTS
    ========================================= */

    if (!openGift) {
        console.error("Open Gift button not found");
        return;
    }

    if (!canvas) {
        console.error("Scratch canvas not found");
        return;
    }


    /* =========================================
       OPEN GIFT
    ========================================= */

    openGift.addEventListener("click", function () {

        console.log("Gift opened");

        opening.classList.add("hidden");

        app.classList.remove("hidden");


        /*
         * Browser allows music because
         * this function is directly triggered
         * by the button click.
         */

        music.volume = 0.7;

        const playPromise = music.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {
                    console.log("Music playing");
                })
                .catch(error => {
                    console.log(
                        "Music could not start:",
                        error
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


        const item =
            memories[index];


        /* PHOTO */

        memoryImage.src =
            item.image;


        /* TITLE */

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(2, "0");


        memoryTitle.innerText =
            item.title;


        /* MESSAGE */

        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");


        specialMessage.innerText =
            item.message;


        /* HIDE MESSAGE */

        messageBox.classList.add(
            "hidden"
        );


        /* SCRATCH TEXT */

        scratchText.style.display =
            "block";


        /* CANVAS */

        canvas.style.display =
            "block";

        canvas.style.pointerEvents =
            "auto";


        /* PROGRESS */

        progressText.innerText =
            `Memory ${index + 1} of 5`;


        progressFill.style.width =
            `${((index + 1) / memories.length) * 100}%`;


        /* NEXT BUTTON */

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


        /*
         * IMPORTANT:
         * Remove old onload
         * and use one function.
         */

        memoryImage.onload =
            function () {

                setTimeout(() => {

                    setupScratch();

                }, 50);

            };


        /*
         * Browser cache case
         */

        if (memoryImage.complete) {

            setTimeout(() => {

                setupScratch();

            }, 50);

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

            console.log(
                "Scratch box has no size"
            );

            return;
        }


        const dpr =
            window.devicePixelRatio || 1;


        /*
         * Reset canvas
         */

        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        /*
         * Reset transform
         */

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


        /*
         * Scratch text
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
         * IMPORTANT
         */

        ctx.globalCompositeOperation =
            "destination-out";


        console.log(
            "Scratch canvas ready"
        );

    }


    /* =========================================
       GET POINTER POSITION
    ========================================= */

    function getPosition(event) {

        const rect =
            canvas.getBoundingClientRect();


        let clientX;
        let clientY;


        if (
            event.touches &&
            event.touches.length > 0
        ) {

            clientX =
                event.touches[0].clientX;

            clientY =
                event.touches[0].clientY;

        } else {

            clientX =
                event.clientX;

            clientY =
                event.clientY;

        }


        return {

            x:
                clientX -
                rect.left,

            y:
                clientY -
                rect.top

        };

    }


    /* =========================================
       SCRATCH FUNCTION
    ========================================= */

    function scratch(event) {

        if (revealed) {
            return;
        }


        event.preventDefault();


        const pos =
            getPosition(event);


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        /*
         * Bigger brush
         */

        ctx.arc(
            pos.x,
            pos.y,
            42,
            0,
            Math.PI * 2
        );


        ctx.fill();


        scratchCount++;


        /*
         * 25 strokes is enough
         */

        if (
            scratchCount >= 25
        ) {

            revealMessage();

        }

    }


    /* =========================================
       MOUSE EVENTS
    ========================================= */

    canvas.addEventListener(
        "mousedown",
        function (event) {

            scratching = true;

            scratch(event);

        }
    );


    canvas.addEventListener(
        "mousemove",
        function (event) {

            if (scratching) {

                scratch(event);

            }

        }
    );


    window.addEventListener(
        "mouseup",
        function () {

            scratching = false;

        }
    );


    /* =========================================
       TOUCH EVENTS
    ========================================= */

    canvas.addEventListener(
        "touchstart",
        function (event) {

            scratching = true;

            scratch(event);

        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "touchmove",
        function (event) {

            if (scratching) {

                scratch(event);

            }

        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "touchend",
        function () {

            scratching = false;

        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "touchcancel",
        function () {

            scratching = false;

        },
        {
            passive: false
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


        /*
         * Clear canvas completely
         */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.style.pointerEvents =
            "none";


        canvas.style.display =
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
            300
        );

    }


    /* =========================================
       NEXT MEMORY
    ========================================= */

    nextButton.addEventListener(
        "click",
        function () {

            if (!revealed) {

                return;

            }


            if (
                current <
                memories.length - 1
            ) {

                loadMemory(
                    current + 1
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                showFinal();

            }

        }
    );


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
       RESIZE FIX
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                !app.classList.contains(
                    "hidden"
                ) &&
                !revealed
            ) {

                setupScratch();

            }

        }
    );


    /* =========================================
       START
    ========================================= */

    console.log(
        "Website JavaScript loaded successfully"
    );

});
