import { playAudio, navigationFx } from "./audio.js";
import { typeWrite } from "./typewriter.js";

const openWindowAudio = navigationFx.find(aud => {
    return aud.name == "openWindow"
})
const closeWindowAudio = navigationFx.find(aud => {
    return aud.name == "closeWindow"
})


function make_draggable(target, animation_props) {
    // Normalize input to array of elements
    let windows = [];
    if (typeof target === "string") {
        windows = Array.from(document.querySelectorAll(target));
    } else if (target instanceof Element) {
        windows = [target];
    }

    // Shared state for active window
    let activeWindow = null;
    let dragMode = null; // "drag" or "resize"
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startX = 0;
    let startY = 0;

    // Initialize each window
    windows.forEach(win => {
        const anchor = win.querySelector(".window-header");
        const resizer = win.querySelector(".window-resizer");
        resizer.classList.add("defaultContS")
        const closeBtn = win.querySelector(".close-btn");
        const maxBtn = win.querySelector(".maximize-btn");
        const minBtn = win.querySelector(".minimize-btn");
        closeBtn.onclick = function () {
            const windowEl = closeBtn.closest(".app-window");
            const windowTitle = windowEl ? windowEl.getAttribute("data-window") : null;
            windowEl.style.animation = `closeWindow ${animation_props ? animation_props.close_delay : 0.4}s ease-out both`
            setTimeout(function () {
                if (windowEl) {
                    windowEl.remove();
                }
                if (windowTitle) {
                    document.dispatchEvent(new CustomEvent("app-window-closed", {
                        detail: {
                            title: windowTitle
                        }
                    }));
                }
                playAudio(closeWindowAudio.path, closeWindowAudio.volume, closeWindowAudio.muted, closeWindowAudio.start)
            }, animation_props ? animation_props.close_delay : 400)
        }
        maxBtn.onclick = function () {
            const targetWindow = maxBtn.closest(".app-window");
            if (targetWindow.classList.contains("fullscreen")) {
                restoreWindow(targetWindow);
                maxBtn.setAttribute("aria-label", "Maximize");
                maxBtn.innerHTML = `<i class="fa-regular fa-window-maximize" aria-hidden="true"></i>`;
            } else {
                maximizeWindow(targetWindow);
                minBtn.setAttribute("aria-label", "Minimize");
                minBtn.innerHTML = `<i class="fa-regular fa-window-minimize" aria-hidden="true"></i>`;
                maxBtn.setAttribute("aria-label", "Restore");
                maxBtn.innerHTML = `<i class="fa-solid fa-compress" aria-hidden="true"></i>`;
            }
        }
        minBtn.onclick = function () {
            const targetWindow = minBtn.closest(".app-window");
            targetWindow.classList.toggle("minimized");
            targetWindow.classList.toggle("defaultCont")
            targetWindow.classList.toggle("modernWindow")
            const isMinimized = targetWindow.classList.contains("minimized");
            minBtn.setAttribute("aria-label", isMinimized ? "Restore" : "Minimize");
            minBtn.innerHTML = isMinimized
                ? `<i class="fa-regular fa-window-restore" aria-hidden="true"></i>`
                : `<i class="fa-regular fa-window-minimize" aria-hidden="true"></i>`;
        }
        if (!anchor || !resizer) return;

        anchor.addEventListener("pointerdown", (e) => {
            if (e.target.closest("button")) return;
            startDrag(e, win);
        });
        resizer.addEventListener("pointerdown", (e) => startResize(e, win));
    });

    function maximizeWindow(win) {
        win.dataset.restoreLeft = win.style.left || `${win.offsetLeft}px`;
        win.dataset.restoreTop = win.style.top || `${win.offsetTop}px`;
        win.dataset.restoreWidth = win.style.width || `${win.offsetWidth}px`;
        win.dataset.restoreHeight = win.style.height || `${win.offsetHeight}px`;
        win.classList.remove("minimized");
        win.classList.add("fullscreen");
        win.style.left = "0";
        win.style.top = "0";
        win.style.width = "100%";
        win.style.height = "100%";
    }

    function restoreWindow(win) {
        win.classList.remove("fullscreen");
        win.style.left = win.dataset.restoreLeft || win.style.left;
        win.style.top = win.dataset.restoreTop || win.style.top;
        win.style.width = win.dataset.restoreWidth || win.style.width;
        win.style.height = win.dataset.restoreHeight || win.style.height;
    }

    function startDrag(event, win) {
        const rect = win.getBoundingClientRect();
        dragOffsetX = event.clientX - rect.left;
        dragOffsetY = event.clientY - rect.top;
        activeWindow = win;
        dragMode = "drag";
        bringToFront(win);
        ensurePositioning(win);
        event.target.setPointerCapture(event.pointerId);
        event.preventDefault();
    }

    function startResize(event, win) {
        const rect = win.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startX = event.clientX;
        startY = event.clientY;
        activeWindow = win;
        dragMode = "resize";
        event.target.setPointerCapture(event.pointerId);
        event.preventDefault();
    }

    function bringToFront(win) {
        document._winZIndex = (document._winZIndex || 1000) + 1;
        win.style.zIndex = document._winZIndex;
    }

    function ensurePositioning(win) {
        if (win.style.position !== "absolute" && win.style.position !== "fixed") {
            win.style.position = "absolute";
        }
    }

    // Global pointer handlers (attached once)
    document.addEventListener("pointermove", (event) => {
        if (!activeWindow) return;

        if (dragMode === "drag") {
            activeWindow.style.left = `${event.clientX - dragOffsetX}px`;
            activeWindow.style.top = `${event.clientY - dragOffsetY}px`;
        } else if (dragMode === "resize") {
            const newWidth = Math.max(220, startWidth + (event.clientX - startX));
            const newHeight = Math.max(180, startHeight + (event.clientY - startY));
            activeWindow.style.width = `${newWidth}px`;
            activeWindow.style.height = `${newHeight}px`;
        }
    });

    document.addEventListener("pointerup", () => {
        activeWindow = null;
        dragMode = null;
    });
}


function create_window(title, default_content, default_position, default_size, animation_props, src, srcdoc, default_pos, default_index) {
    playAudio(openWindowAudio.path, openWindowAudio.volume, openWindowAudio.muted, openWindowAudio.start)
    if (!title) title = "Preview";
    const win = document.createElement("div");
    win.className = "app-window";
    win.setAttribute("aria-label", title);

    const header = document.createElement("header");
    header.className = "window-header";
    header.classList.add("defaultCont")
    header.classList.add("defaultContS")

    const titleSpan = document.createElement("span");
    titleSpan.className = "window-title";
    titleSpan.textContent = title;
    titleSpan.setAttribute("data-title", title)

    const controls = document.createElement("nav");
    controls.className = "window-controls";
    controls.setAttribute("aria-label", "Window controls");

    const buttonData = [
        { className: "control-btn minimize-btn", label: "Minimize", icon: "fa-regular fa-window-minimize" },
        { className: "control-btn maximize-btn", label: "Maximize", icon: "fa-regular fa-window-maximize" },
        { className: "control-btn close-btn", label: "Close", icon: "fa-solid fa-xmark" }
    ];

    buttonData.forEach(({ className, label, icon }) => {
        const button = document.createElement("button");
        button.className = className;
        button.setAttribute("aria-label", label);
        button.setAttribute("type", "button");
        button.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
        controls.appendChild(button);
    });

    header.appendChild(titleSpan);
    header.appendChild(controls);

    const frame = document.createElement("div");
    frame.className = "window-frame-wrap";
    frame.setAttribute("aria-hidden", "true");
    frame.innerHTML = default_content ? default_content : `<iframe class='iframe'></iframe > `;
    const viewport = frame.querySelector(".iframe")
    if (viewport) {
        if (srcdoc) {
            viewport.srcdoc = srcdoc
        }
        if (src) {
            viewport.src = src
        }
    }

    const resizer = document.createElement("div");
    resizer.className = "window-resizer";
    resizer.setAttribute("aria-hidden", "true");

    win.setAttribute("data-window", title)
    win.appendChild(header);
    win.appendChild(frame);
    win.appendChild(resizer);

    // Apply default position after window structure is complete
    if (default_position) {
        win.style.position = "fixed";
        win.style.left = `${default_position.x}px`;
        win.style.top = `${default_position.y}px`;
    }
    if (default_size) {
        win.style.width = `${default_size.width}px`;
        win.style.height = `${default_size.height}px`;
    }
    win.style.animation = `openWindow ${animation_props ? animation_props.open_length : 0.6}s ease forwards`
    if (default_pos) {
        win.style.left = `${default_pos.x}px`
        win.style.top = `${default_pos.y}px`
    }
    if (default_index) {
        win.style.index = default_index;
    }
    const ram = navigator.deviceMemory || 8; // Default to 8GB if not available
    if (ram < 24) {
        console.log("Your device has less than 24GB of RAM. For optimal performance, please close other applications or browser tabs before opening multiple windows in this portfolio.");
    }
    return win;
}

export { make_draggable, create_window }
