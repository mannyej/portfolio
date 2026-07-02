let typeWrote = [];
let typeWriterTracker = 0;

function typeWrite(target, text, delay) {
    typeWriterTracker++;
    console.log("typeWrite fired", { typeWriterTracker, text, delay, target });
    typeWriterTracker++
    typeWrote.push({
        text: text,
        target: target,
        delay: delay
    })
    const textArray = Array.from(text)
    const targetElem = target;
    let iterator = 0;
    targetElem.innerHTML = " "

    const activeType = setInterval(function () {
        iterator++
        targetElem.innerHTML += `${textArray[iterator - 1]}`
        if (iterator > textArray.length - 1) {
            clearInterval(activeType)
            return
        }
    }, delay)
}

function typeWriteTimed(target, text, delay, elapsedTime) {
    typeWriterTracker++;
    typeWrote.push({
        text: text,
        target: target,
        delay: delay,
        elapsedTime: elapsedTime
    });
    console.log("typeWriteTimed fired", { typeWriterTracker, text, delay, elapsedTime, target });
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

function typeWriteAdvanced(target, text, delay, stopAfter, wait) {
    let characters = 0;
    const textArray = Array.from(text)
    const targetElem = target;
    let iterator = 0;
    targetElem.innerHTML = " "

    const activeType = setInterval(function () {
        characters++
        iterator++
        targetElem.innerHTML += `${textArray[iterator - 1]}`
        if (iterator > textArray.length - 1) {
            clearInterval(activeType)
            return
        }
        if (characters > stopAfter) {
            setTimeout(function () {
                return
            }, wait)
        }
    }, delay)

}

export { typeWrite, typeWriteTimed, typeWriteAdvanced, typeWrote, typeWriterTracker }