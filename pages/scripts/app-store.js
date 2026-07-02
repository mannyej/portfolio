import { typeWriteTimed } from "../../modules/typewriter.js";

window.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.querySelector("#store-hero-title");
    const heroCopy = document.querySelectorAll(".store-copy");
    const storeButtons = document.querySelectorAll(".store-btn");
    const cursorElem = document.querySelector("#cursorCont");

    typeWriteTimed(heroTitle, heroTitle.textContent.trim(), 55, 0.3);

    heroCopy.forEach((element, index) => {
        typeWriteTimed(element, element.textContent.trim(), 22, 0.8 + index * 0.15);
    });

    storeButtons.forEach((button) => {
        button.addEventListener("mouseover", () => {
            button.style.transform = "translateY(-2px) scale(1.01)";
        });
        button.addEventListener("mouseout", () => {
            button.style.transform = "translateY(0) scale(1)";
        });
    });

    const radiusX = cursorElem.offsetWidth / 2;
    const radiusY = cursorElem.offsetHeight / 2;

    window.addEventListener("mousemove", (event) => {
        cursorElem.style.left = `${event.clientX - radiusX}px`;
        cursorElem.style.top = `${event.clientY - radiusY}px`;
    });
});
