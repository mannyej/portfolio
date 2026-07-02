import { typeWriteTimed } from "../../modules/typewriter.js";

window.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.querySelector("#case-hero-title");
    const heroCopy = document.querySelectorAll(".case-copy");
    const links = document.querySelectorAll(".case-btn");
    const cursorElem = document.querySelector("#cursorCont");

    typeWriteTimed(heroTitle, heroTitle.textContent.trim(), 55, 0.3);

    heroCopy.forEach((element, index) => {
        typeWriteTimed(element, element.textContent.trim(), 24, 0.8 + index * 0.16);
    });

    links.forEach((link) => {
        link.addEventListener("mouseover", () => {
            link.style.transform = "translateY(-2px) scale(1.01)";
        });
        link.addEventListener("mouseout", () => {
            link.style.transform = "translateY(0) scale(1)";
        });
    });

    window.addEventListener("mousemove", (event) => {
        cursorElem.style.left = `${event.clientX}px`;
        cursorElem.style.top = `${event.clientY}px`;
    });
});
