import { create_window, make_draggable } from "./modules/window.js";
import { makeElem, addChild, selectE } from "./modules/elements.js";
import { win_anim } from "./modules/win_anim.js";
import { typeWrite, typeWriteTimed } from "./modules/typewriter.js";
import { hourElem, dateElem, window_title, introH, closeCoverbtn, introCover, batteryPercentElem } from "./modules/nav_selector.js";
import { navigationFx, playAudio, gradualChangeA } from "./modules/audio.js";
import { apps } from "./modules/apps.js";
const desktop_env = document.querySelector(".desktop");
const appDock = document.querySelector("#appDock")

const idleRef = navigationFx.find(obj => {
    return obj.name == "idle"
})

const idleTrack = new Audio(idleRef.path)

gradualChangeA(0, idleRef.volume, 100, null, "i", idleTrack)
idleTrack.play()

const calcWaitTime = function (text, speed) {
    const waitTime = text.length * speed;
    return waitTime;
}

let typeWrote = [

]
let typeWriterTracker = 0;

typeWriteTimed(introH, "WELCOME TO MY PORTFOLIO... HOPE YOU ENJOY THE EXPERIENCE!", 70, 0.2)
console.log(typeWrote)
typeWriteTimed(selectE("#introIntro"), "Introduction", 80, 4)
typeWriteTimed(selectE("#introIntroP"), "Welcome, you found the hidden side of this portfolio. This space is built like a small desktop so you can open apps, explore projects, and see how the interface responds. I focus on front-end experiences that feel clean, animated, and useful, with attention to layout, motion, and the tiny details that make a page feel alive.", 40, 3)

closeCoverbtn.onclick = function () {
    introCover.style.animation = "introEnd 4s ease forwards";
    introCover.style.pointerEvents = "none";
    setTimeout(function () {
        introCover.style.display = "none"
    }, 4 * 1000)
}

//date animation
function updateDate() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    const time = `${displayHours}:${displayMinutes} ${ampm}`;

    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const date = `${month}/${day}/${year}`;

    typeWrite(hourElem, time, 100)
    typeWrite(dateElem, date, 100)
}
function whiteToRed(value) {
    const t = Math.min(Math.max(value, 0), 100) / 100; // clamp 0–100
    const r = 255;
    const g = Math.round(255 * t);
    const b = Math.round(255 * t);
    return `rgb(${r}, ${g}, ${b})`;
}

function batteryStatusLabel(level, charging) {
    if (charging) {
        return level >= 0.95 ? "Charged" : "Charging";
    }
    if (level <= 0.05) {
        return "Critical";
    }
    if (level <= 0.2) {
        return "Plug in";
    }
    if (level <= 0.4) {
        return "Low";
    }
    if (level <= 0.7) {
        return "Decent";
    }
    if (level <= 0.9) {
        return "Good";
    }
    return "Full";
}

function updateBattery() {
    if (navigator.getBattery) {
        navigator.getBattery().then(function (battery) {
            const levelRef = battery.level * 100;
            batteryPercentElem.setAttribute("data-battery", batteryStatusLabel(battery.level, battery.charging));
            batteryPercentElem.style.color = whiteToRed(levelRef);
            typeWrite(batteryPercentElem, `${Math.round(levelRef)}%`, 200)
            battery.addEventListener('levelchange', function () {
                const newLevelRef = battery.level * 100;
                batteryPercentElem.style.color = whiteToRed(newLevelRef);
                batteryPercentElem.setAttribute("data-battery", batteryStatusLabel(battery.level, battery.charging));
                typeWrite(batteryPercentElem, `${Math.round(newLevelRef)}%`, 200)
            });
            battery.addEventListener('chargingchange', function () {
                const changedLevelRef = battery.level * 100;
                batteryPercentElem.setAttribute("data-battery", batteryStatusLabel(battery.level, battery.charging));
                batteryPercentElem.style.color = whiteToRed(changedLevelRef);
                typeWrite(batteryPercentElem, `${Math.round(changedLevelRef)}%`, 200)
            });
        });
    }
}
updateDate()
updateBattery()

function addDefaultApps() {
    apps.forEach((app, index) => {
        const newApp = makeElem("div", "",)
        newApp.className = "appDockApp"
        appDock.appendChild(newApp)
        newApp.style.backgroundImage = `url(${app.icon})`
        newApp.style.backgroundRepeat = "no-repeat"
        newApp.style.backgroundPosition = "center center"
        newApp.style.backgroundSize = "50%"
        newApp.onclick = function () {
            gradualChangeA(idleRef.volume, 4, 10, null, "d", idleTrack)
            if (navigator.memory && navigator.deviceMemory < 24) {
                console.log("Your device has less than 24GB of RAM. For optimal performance, please close other applications or browser tabs before opening multiple windows in this portfolio.");
            }
            app.windows_open++;
            console.log(app.windows_open);
            updateWindowUsage()
            newApp.setAttribute("data-windowindex", index)
            const title = app.title;
            const position = app.default_pos ? app.default_pos : { x: 0, y: 0 }
            const size = app.default_size ? app.default_size : { width: 400, height: 280 }
            add_window(title, null, position, size, app.src, null, app.default_index ? app.default_index : null);
            make_draggable(".app-window");
        }
        // Note the single or double quotes tightly wrapping the template variable
        newApp.style.setProperty("--title", `"${app.title}(${app.windows_open})"`);
        newApp.setAttribute("data-windows-open", app.windows_open)
    })
}

function updateWindowUsage() {
    const newapps = document.querySelectorAll(".appDockApp");
    newapps.forEach((app, index) => {
        app.style.setProperty("--title", `"${apps[index].title}(${apps[index].windows_open})"`);
        app.setAttribute("data-windows-open", apps[index].windows_open)
        const targetApp = apps[index];
        if (targetApp.windows_open > 0) {
            app.classList.add("activeWindow")
        } else {
            app.classList.remove("activeWindow")
        }
        if (targetApp.windows_open > 1) {
            app.classList.add("multiOpen")
        } else {
            app.classList.remove("multiOpen")
        }
    })
}

document.addEventListener("app-window-closed", (event) => {
    const title = event?.detail?.title;
    if (!title) return;
    const targetApp = apps.find((app) => app.title === title);
    if (!targetApp) return;
    targetApp.windows_open = Math.max(0, targetApp.windows_open - 1);
    updateWindowUsage();
});

addDefaultApps()

// create a new window and add it to the desktop container
function add_window(title, content, position, size, src, srcdoc, defaultIndex) {
    const newWinow = create_window(title, content ? content : false, position, size, win_anim, src ? src : null, srcdoc ? srcdoc : null, null, defaultIndex ? defaultIndex : null)
    console.log(win_anim)
    addChild(desktop_env, newWinow)
    typeWrite(newWinow.querySelector(".window-title"), newWinow.querySelector(".window-title").getAttribute("data-title"), 100)
}

// Helper to generate random numbers
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create random windows
const titles = ["Chrome", "Firefox", "Spotify", "Discord", "Slack", "Notion", "VSCode", "Terminal", "Settings", "Explorer", "Paint", "Media Player"];
const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];

export { apps, updateWindowUsage, typeWrote, typeWriterTracker }


make_draggable(".app-window");
