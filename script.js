document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================
           ELEMENTS
        ====================================== */

        const startScreen =
            document.getElementById(
                "startScreen"
            );


        const mainContent =
            document.getElementById(
                "mainContent"
            );


        const startBtn =
            document.getElementById(
                "startBtn"
            );


        const music =
            document.getElementById(
                "bgMusic"
            );


        /* =====================================
           START WEBSITE
        ====================================== */

        startBtn.addEventListener(
            "click",
            async () => {


                startScreen.classList.add(
                    "hidden"
                );


                mainContent.classList.remove(
                    "hidden"
                );


                /*
                 * Start music after
                 * user's click.
                 */

                try {

                    music.volume = 0.65;

                    await music.play();

                }

                catch (error) {

                    console.log(
                        "Music autoplay blocked:",
                        error
                    );

                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );



        /* =====================================
           SCRATCH CARDS
        ====================================== */

        const canvases =
            document.querySelectorAll(
                ".scratch-canvas"
            );


        let currentMemory = 0;


        canvases.forEach(
            (canvas, index) => {


                const container =
                    canvas.parentElement;


                const memorySection =
                    container.closest(
                        ".memory-section"
                    );


                const specialMessage =
                    document.getElementById(
                        `special${index + 1}`
                    );


                const ctx =
                    canvas.getContext(
                        "2d",
                        {
                            willReadFrequently: true
                        }
                    );


                let isDrawing = false;

                let lastX = 0;

                let lastY = 0;

                let revealed = false;



                /* =================================
                   SETUP CANVAS
                ================================== */

                function setupCanvas() {


                    const rect =
                        container.getBoundingClientRect();


                    const dpr =
                        Math.max(
                            1,
                            window.devicePixelRatio || 1
                        );


                    canvas.width =
                        rect.width * dpr;


                    canvas.height =
                        rect.height * dpr;


                    canvas.style.width =
                        rect.width + "px";


                    canvas.style.height =
                        rect.height + "px";


                    ctx.setTransform(
                        dpr,
                        0,
                        0,
                        dpr,
                        0,
                        0
                    );


                    /*
                     * Scratch cover gradient
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
                        "#80606d"
                    );


                    gradient.addColorStop(
                        .5,
                        "#d0a2b0"
                    );


                    gradient.addColorStop(
                        1,
                        "#704d5b"
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
                     * Scratch texture
                     */

                    for (
                        let i = 0;
                        i < 800;
                        i++
                    ) {


                        const x =
                            Math.random() *
                            rect.width;


                        const y =
                            Math.random() *
                            rect.height;


                        ctx.fillStyle =
                            `rgba(
                                255,
                                255,
                                255,
                                ${Math.random() * .08}
                            )`;


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


                    /*
                     * Cover text
                     */

                    ctx.fillStyle =
                        "rgba(255,255,255,.9)";


                    ctx.font =
                        "bold 20px Georgia";


                    ctx.textAlign =
                        "center";


                    ctx.textBaseline =
                        "middle";


                    ctx.fillText(
                        "✨ Scratch Me ✨",
                        rect.width / 2,
                        rect.height / 2
                    );

                }



                /* =================================
                   GET POSITION
                ================================== */

                function getPosition(event) {


                    const rect =
                        canvas.getBoundingClientRect();


                    let clientX;

                    let clientY;


                    if (
                        event.touches &&
                        event.touches.length
                    ) {


                        clientX =
                            event.touches[0].clientX;


                        clientY =
                            event.touches[0].clientY;

                    }

                    else {


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



                /* =================================
                   START SCRATCH
                ================================== */

                function startScratch(event) {


                    if (
                        revealed ||
                        index !== currentMemory
                    ) {
                        return;
                    }


                    isDrawing = true;


                    const position =
                        getPosition(event);


                    lastX =
                        position.x;


                    lastY =
                        position.y;


                    event.preventDefault();

                }



                /* =================================
                   SCRATCH
                ================================== */

                function scratch(event) {


                    if (
                        !isDrawing ||
                        revealed ||
                        index !== currentMemory
                    ) {
                        return;
                    }


                    event.preventDefault();


                    const position =
                        getPosition(event);


                    ctx.globalCompositeOperation =
                        "destination-out";


                    ctx.lineWidth =
                        48;


                    ctx.lineCap =
                        "round";


                    ctx.lineJoin =
                        "round";


                    /*
                     * Draw scratch line
                     */

                    ctx.beginPath();


                    ctx.moveTo(
                        lastX,
                        lastY
                    );


                    ctx.lineTo(
                        position.x,
                        position.y
                    );


                    ctx.stroke();


                    /*
                     * Scratch circle
                     */

                    ctx.beginPath();


                    ctx.arc(
                        position.x,
                        position.y,
                        24,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    lastX =
                        position.x;


                    lastY =
                        position.y;


                    checkReveal();

                }



                /* =================================
                   STOP
                ================================== */

                function stopScratch() {

                    isDrawing = false;

                }



                /* =================================
                   CHECK REVEAL
                ================================== */

                function checkReveal() {


                    const width =
                        canvas.width;


                    const height =
                        canvas.height;


                    const imageData =
                        ctx.getImageData(
                            0,
                            0,
                            width,
                            height
                        );


                    let transparent =
                        0;


                    let total =
                        0;


                    /*
                     * Sample pixels
                     */

                    for (
                        let i = 3;
                        i < imageData.data.length;
                        i += 64
                    ) {


                        total++;


                        if (
                            imageData.data[i] <
                            80
                        ) {

                            transparent++;

                        }

                    }


                    const percentage =
                        (
                            transparent /
                            total
                        ) * 100;


                    /*
                     * Reveal after 50%
                     */

                    if (
                        percentage >= 50
                    ) {

                        revealMemory();

                    }

                }



                /* =================================
                   REVEAL MEMORY
                ================================== */

                function revealMemory() {


                    if (revealed) {
                        return;
                    }


                    revealed = true;


                    /*
                     * Clear canvas
                     */

                    ctx.clearRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );


                    canvas.style.pointerEvents =
                        "none";


                    /*
                     * Hide scratch text
                     */

                    const label =
                        container.querySelector(
                            ".scratch-label"
                        );


                    if (label) {

                        label.style.display =
                            "none";

                    }


                    /*
                     * Show special message
                     */

                    setTimeout(
                        () => {

                            specialMessage.classList.add(
                                "show"
                            );

                        },
                        300
                    );


                    /*
                     * Unlock next memory
                     */

                    setTimeout(
                        () => {

                            unlockNextMemory(
                                index
                            );

                        },
                        1800
                    );

                }



                /* =================================
                   UNLOCK NEXT
                ================================== */

                function unlockNextMemory(
                    completedIndex
                ) {


                    const nextIndex =
                        completedIndex + 1;


                    /*
                     * If all 5 completed
                     */

                    if (
                        nextIndex >=
                        canvases.length
                    ) {

                        showFinalButton();

                        return;

                    }


                    currentMemory =
                        nextIndex;


                    const nextSection =
                        document.getElementById(
                            `memory${nextIndex + 1}`
                        );


                    if (nextSection) {


                        nextSection.classList.remove(
                            "locked"
                        );


                        nextSection.classList.add(
                            "unlocked"
                        );


                        /*
                         * Small hint
                         */

                        const hint =
                            document.createElement(
                                "div"
                            );


                        hint.className =
                            "next-hint";


                        hint.innerHTML =
                            "✨ Next memory unlocked...";


                        nextSection.appendChild(
                            hint
                        );


                        /*
                         * Smooth scroll
                         */

                        setTimeout(
                            () => {

                                nextSection.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",
                                        block:
                                            "center"
                                    }
                                );

                            },
                            500
                        );

                    }

                }



                /* =================================
                   MOUSE EVENTS
                ================================== */

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



                /* =================================
                   TOUCH EVENTS
                ================================== */

                canvas.addEventListener(
                    "touchstart",
                    startScratch,
                    {
                        passive: false
                    }
                );


                canvas.addEventListener(
                    "touchmove",
                    scratch,
                    {
                        passive: false
                    }
                );


                canvas.addEventListener(
                    "touchend",
                    stopScratch
                );



                /*
                 * Initial canvas
                 */

                setupCanvas();



                /*
                 * Resize
                 */

                window.addEventListener(
                    "resize",
                    () => {

                        if (
                            !revealed
                        ) {

                            setupCanvas();

                        }

                    }
                );

            }
        );



        /* =====================================
           FINAL BUTTON
        ====================================== */

        function showFinalButton() {


            const finalSection =
                document.querySelector(
                    ".final-section"
                );


            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                "❤️ Continue to Final Message";


            button.className =
                "start-button final-button";


            button.style.display =
                "block";


            button.style.margin =
                "40px auto 0";


            finalSection
                .querySelector(
                    ".final-content"
                )
                .appendChild(
                    button
                );


            button.addEventListener(
                "click",
                () => {

                    finalSection.scrollIntoView(
                        {
                            behavior:
                                "smooth"
                        }
                    );

                }
            );

        }



        /* =====================================
           AKKA FEEDBACK
        ====================================== */

        const feedbackSection =
            document.getElementById(
                "feedback"
            );


        const typingText =
            document.getElementById(
                "typingText"
            );


        const feedbackMessage =
            document.getElementById(
                "feedbackMessage"
            );


        let feedbackStarted =
            false;



        const feedbackObserver =
            new IntersectionObserver(
                (entries) => {


                    entries.forEach(
                        (entry) => {


                            if (
                                entry.isIntersecting &&
        
