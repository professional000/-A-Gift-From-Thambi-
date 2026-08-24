document.addEventListener("DOMContentLoaded", () => {

    const memories = [
        {
            image: "photos/photo1.jpg",
            title: "ஒரு அழகான நினைவு ❤️",
            message: "Akka & Mama... உங்கள் வாழ்க்கை முழுவதும் அன்பும் சந்தோஷமும் நிறைந்திருக்கட்டும். ❤️"
        },
        {
            image: "photos/photo2.jpg",
            title: "இன்னொரு அழகான தருணம் 💕",
            message: "எத்தனை வருடங்கள் ஆனாலும் உங்கள் அன்பும் smile-உம் இப்படியே இருக்கட்டும். ❤️"
        },
        {
            image: "photos/photo3.jpg",
            title: "Love + Friendship ❤️",
            message: "Husband & Wife-ஆக மட்டும் இல்லாமல், எப்போதும் best friends-ஆகவும் இருங்கள். ❤️"
        },
        {
            image: "photos/photo4.jpg",
            title: "உங்கள் சந்தோஷம் 💖",
            message: "உங்கள் வீட்டில் சிரிப்பும், சந்தோஷமும், அன்பும் எப்போதும் நிறைந்திருக்கட்டும். ❤️"
        },
        {
            image: "photos/photo5.jpg",
            title: "The Final Memory 💞",
            message: "இன்னும் பல வருடங்கள், பல Anniversary-கள், பல அழகான memories-ஐ இருவரும் சேர்ந்து உருவாக்குங்கள். ❤️"
        }
    ];

    let current = 0;
    let scratching = false;
    let scratchCount = 0;
    let revealed = false;

    const opening = document.getElementById("opening");
    const app = document.getElementById("app");
    const openGift = document.getElementById("openGift");

    const music = document.getElementById("bgMusic");

    const memoryImage = document.getElementById("memoryImage");
    const canvas = document.getElementById("scratchCanvas");
    const ctx = canvas.getContext("2d");

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
    const feedbackPage = document.getElementById("feedbackPage");
    const feedbackButton = document.getElementById("feedbackButton");

    const typing = document.getElementById("typing");
    const feedbackText = document.getElementById("feedbackText");


    /* ======================================
       OPEN GIFT
    ====================================== */

    openGift.addEventListener("click", () => {

        opening.classList.add("hidden");
        app.classList.remove("hidden");

        music.volume = 0.7;

        music.play().catch(() => {
            console.log("Music waiting for user interaction");
        });

        loadMemory(0);
    });


    /* ======================================
       LOAD PHOTO
    ====================================== */

    function loadMemory(index) {

        current = index;

        revealed = false;
        scratchCount = 0;
        scratching = false;

        const item = memories[index];

        memoryImage.src = item.image;

        memoryNumber.innerText =
            "MEMORY " +
            String(index + 1).padStart(2, "0");

        memoryTitle.innerText =
            item.title;

        messageNumber.innerText =
            "SPECIAL MESSAGE " +
            String(index + 1).padStart(2, "0");

        specialMessage.innerText =
            item.message;

        messageBox.classList.add("hidden");

        scratchText.style.display = "block";

        canvas.style.display = "block";

        canvas.style.pointerEvents = "auto";

        progressText.innerText =
            `Memory ${index + 1} of 5`;

        progressFill.style.width =
            `${((index + 1) / 5) * 100}%`;

        nextButton.innerText =
            index === memories.length - 1
                ? "❤️ Final Message"
                : "Next Memory ❤️";


        /*
         * Wait until image is loaded
         */

        memoryImage.onload = () => {

            setupScratch();

        };


        /*
         * If image already loaded
         */

        if (memoryImage.complete) {

            setupScratch();

        }
    }


    /* ======================================
       SETUP CANVAS
    ====================================== */

    function setupScratch() {

        const rect =
            canvas.parentElement.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        if (width <= 0 || height <= 0) {
            return;
        }

        const dpr =
            window.devicePixelRatio || 1;


        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;

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


        /*
         * Scratch cover
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
            "#7a5262"
        );

        gradient.addColorStop(
            0.5,
            "#c6a0ae"
        );

        gradient.addColorStop(
            1,
            "#704656"
        );

        ctx.globalCompositeOperation =
            "source-over";

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Scratch instruction
         */

        ctx.fillStyle =
            "rgba(255,255,255,0.18)";

        ctx.font =
            "bold 20px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "✨ SCRATCH HERE ✨",
            width / 2,
            height / 2
        );


        ctx.globalCompositeOperation =
            "destination-out";

    }


    /* ======================================
       GET MOUSE / TOUCH POSITION
    ====================================== */

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

            clientX =
                event.clientX;

            clientY =
                event.clientY;

        }


        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }


    /* ======================================
       SCRATCH
    ====================================== */

    function scratch(event) {

        if (revealed) {
            return;
        }

        const pos =
            getPosition(event);

        ctx.globalCompositeOperation =
            "destination-out";

        ctx.beginPath();

        ctx.arc(
            pos.x,
            pos.y,
            35,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * Bigger scratch area
         */

        scratchCount++;


        /*
         * After enough scratching
         */

        if (scratchCount >= 35) {

            revealMessage();

        }

        event.preventDefault();
    }


    /* ======================================
       MOUSE
    ====================================== */

    canvas.addEventListener(
        "mousedown",
        event => {

            scratching = true;

            scratch(event);

        }
    );


    canvas.addEventListener(
        "mousemove",
        event => {

            if (scratching) {

                scratch(event);

            }

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            scratching = false;

        }
    );


    /* ======================================
       TOUCH
    ====================================== */

    canvas.addEventListener(
        "touchstart",
        event => {

            scratching = true;

            scratch(event);

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchmove",
        event => {

            if (scratching) {

                scratch(event);

            }

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchend",
        () => {

            scratching = false;

        },
        { passive: false }
    );


    /* ======================================
       REVEAL MESSAGE
    ====================================== */

    function revealMessage() {

        if (revealed) {
            return;
        }

        revealed = true;

        /*
         * Remove scratch layer
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
         * Show message
         */

        setTimeout(() => {

            messageBox.classList.remove(
                "hidden"
            );

            messageBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 400);
    }


    /* ======================================
       NEXT MEMORY
    ====================================== */

    nextButton.addEventListener(
        "click",
        () => {

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


    /* ======================================
       FINAL PAGE
    ====================================== */

    function showFinal() {

        document
            .querySelector(".top")
            .classList.add("hidden");

        document
            .querySelector(".progress-area")
            .classList.add("hidden");

        document
            .querySelector(".memory-page")
            .classList.add("hidden");

        finalPage.classList.remove(
            "hidden"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* ======================================
       AKKA FEEDBACK
    ====================================== */

    feedbackButton.addEventListener(
        "click",
        () => {

            finalPage.classList.add(
                "hidden"
            );

            feedbackPage.classList.remove(
                "hidden"
            );

            typing.innerText =
                "Akka is typing...";

            feedbackText.classList.remove(
