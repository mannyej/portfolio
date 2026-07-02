function typeWriteTimed(target, text, delay, elapsedTime) {
    const textArray = Array.from(text)
    const targetElem = target;
    let iterator = 0;
    targetElem.innerHTML = " "
    setTimeout(function () {
        const activeType = setInterval(function () {
            iterator++
            targetElem.innerHTML += `${textArray[iterator - 1]}`
            if (iterator > textArray.length - 1) {
                clearInterval(activeType)
                return
            }
        }, delay)
    }, elapsedTime * 1000)

}
function selectE(type) {
    const target = document.querySelector(type);
    return target;
}

function smoothScrollTo(target, duration = 750) {
    const navOffset = document.querySelector("#navBar").offsetHeight + 16;
    const startPosition = window.scrollY;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeOutCubic(progress) {
        return 1 - Math.pow(1 - progress, 3);
    }

    function animateScroll(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startPosition + distance * easeOutCubic(progress));

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

const hero_title = selectE("#hero-header")

//intiate hero section
const herobtns = document.querySelectorAll(".hero-btn");
herobtns.forEach((btn) => {
    typeWriteTimed(btn, btn.innerHTML, 80, 0.5)
    btn.addEventListener("click", function () {
        const target = document.querySelector(btn.dataset.target);
        if (target) {
            smoothScrollTo(target);
        }
    })
})

const allText = document.querySelectorAll(".general-text");
allText.forEach((btn) => {
    typeWriteTimed(btn, btn.innerHTML, 35, 0.5)
})

setTimeout(function () {
    hero_title.style.setProperty("--blink-display", "flex")
}, 1000)

typeWriteTimed(hero_title, "WELCOME TO SIMPLIFIED", 50, 0.5)

//intiaite core features

//make cusotm cursor 
const cursorElem = document.querySelector("#cursorCont");

const radiusX = cursorElem.offsetWidth / 2;
const radiusY = cursorElem.offsetHeight / 2;

// Change document.body to window
window.addEventListener("mousemove", function (event) {
    cursorElem.style.left = `${event.clientX - radiusX}px`;
    cursorElem.style.top = `${event.clientY - radiusY}px`;
});










