function typeWriteTimed(target, text, delay, elapsedTime) {
    const textArray = Array.from(text);
    const targetElem = target;
    let iterator = 0;
    targetElem.innerHTML = "";

    setTimeout(function () {
        const activeType = setInterval(function () {
            targetElem.innerHTML += `${textArray[iterator]}`;
            iterator++;
            if (iterator >= textArray.length) {
                clearInterval(activeType);
                return;
            }
        }, delay);
    }, elapsedTime * 1000);
}

const typeTargets = document.querySelectorAll(".typing-target");
let delayOffset = 0.1;

typeTargets.forEach((target) => {
    const text = target.textContent.trim();
    typeWriteTimed(target, text, 40, delayOffset);
    delayOffset += 0.15;
});

const settingsTitle = document.querySelector("#settingsTitle");
if (settingsTitle) {
    setTimeout(() => {
        settingsTitle.style.setProperty("--blink-display", "inline-block");
    }, delayOffset * 1000 + 200);
}
