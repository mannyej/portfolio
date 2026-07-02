function playAudio(path, volume = 100, muted = false, start = 0) {
    if (!path) return;

    try {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.volume = Math.max(0, Math.min(1, volume / 100));
        audio.muted = muted;

        if (typeof start === "number" && Number.isFinite(start)) {
            audio.currentTime = start;
        }

        const playback = audio.play();
        if (playback && typeof playback.catch === "function") {
            playback.catch(() => {
                // Ignore autoplay restrictions silently so the UI still works.
            });
        }
    } catch (error) {
        console.warn("Audio playback failed:", error);
    }
}

function gradualChangeA(v, tv, delay, cb, mode, audio) {
    audio.volume = 0;
    // 1. Return a Promise so the caller can use .then()
    return new Promise((resolve) => {
        const startTime = Date.now();
        const data = {};

        const start = setInterval(function () {
            if (mode === "d") {
                v--;
            } else if (mode === "i") {
                v++;
            }
            data.value = v;
            audio.volume = v / 100; // Adjust volume based on the value
            data.time = Date.now() - startTime;
            if (cb) cb();
            if (v >= tv && mode === "i" || v <= tv && mode === "d") {
                clearInterval(start);
                // 2. Use resolve() instead of return to pass the data out
                resolve(data);
            }
        }, delay);
    });
}


const navigationFx = [
    { id: 0, name: "openWindow", path: "audio/navigation/open.mp3", volume: 20, muted: false, start: 0.28 },
    { id: 1, name: "closeWindow", path: "audio/navigation/close.mp3", volume: 20, muted: false, start: 2 },
    { id: 2, name: "idle", path: "audio/idle/idle.mp3", volume: 70, muted: false }
]

export { playAudio, navigationFx, gradualChangeA }