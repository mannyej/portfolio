const audioTrack = new Audio("./audios/delirious.mp3");
const containers = Array.from(document.querySelectorAll(".container, #header, #heroCont"));


let typeWrote = [];
let typeWriterTracker = 0;


//improted functions
function addChild(parent, child) {
  parent.appendChild(child)
}

function selectE(type) {
  const target = document.querySelector(type);
  return target;
}

function makeElem(type, content, attr) {
  let newElement = document.createElement(type)
  if (attr) {
    attr = Object.entries(attr)
    attr.forEach(([key, value], index) => {
      newElement.setAttribute(key, value)
    })
  }
  if (content) {
    newElement.innerHTML = content;
  }


  return newElement
}




function resetTyping(targetElem, text) {
  targetElem.textContent = "";
  targetElem.dataset.text = text || targetElem.dataset.text || "";
  return targetElem;
}


function typeWrite(target, text, delay) {

  console.log("typeWrite fired", { typeWriterTracker, text, delay, target });
  const targetElem = target;

  // set a plain-text value for the pseudo-element glitch layers
  const plainText = String(text).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  targetElem.dataset.text = plainText;

  // clear any existing content before typing
  targetElem.innerHTML = "";

  const textArray = Array.from(text);
  let iterator = 0;
  let currentText = "";

  const activeType = setInterval(function () {
    if (iterator >= textArray.length) {
      clearInterval(activeType);
      return;
    }

    const char = textArray[iterator];

    // if we encounter a tag start, append the whole tag chunk at once
    if (char === "<") {
      const tagEnd = text.indexOf(">", iterator);
      if (tagEnd !== -1) {
        const tagText = text.slice(iterator, tagEnd + 1);
        currentText += tagText;
        targetElem.innerHTML = currentText;
        iterator = tagEnd + 1;
        return;
      }
    }

    currentText += char;
    targetElem.innerHTML = currentText;
    iterator++;
  }, delay);
}

function typeWriteTimed(target, text, delay, elapsedTime) {

  console.log("typeWriteTimed fired", { typeWriterTracker, text, delay, elapsedTime, target });
  const textArray = Array.from(text)
  const targetElem = target;
  const textNode = resetTyping(targetElem, text);
  let iterator = 0;
  setTimeout(function () {
    const activeType = setInterval(function () {
      iterator++
      textNode.textContent += `${textArray[iterator - 1]}`
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
  const textNode = resetTyping(targetElem, text);
  let iterator = 0;

  const activeType = setInterval(function () {
    characters++
    iterator++
    textNode.textContent += `${textArray[iterator - 1]}`
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
//initiate home
const headerElement = selectE("#header");
const heroElement = selectE("#heroCont");

//hide containers initially
selectE("#header").style.display = "none";
selectE("#heroCont").style.display = "none";

//reveal containers after a delay
setTimeout(function () {
  selectE("#header").style.display = "flex";
  typeWrite(selectE("#headerT"), "WELCOME TO ABOUT ME", 80);

}, 3500);
setTimeout(function () {
  selectE("#heroCont").style.display = "flex";
}, 1000);
setTimeout(function () {
  selectE("#header").classList.add("nav");
}, 3500);

function triggerOccasionalShakes() {
  if (!containers.length) return;

  const shakeContainer = () => {
    const target = containers[Math.floor(Math.random() * containers.length)];
    if (!target) return;

    target.classList.remove("shake");
    void target.offsetWidth;
    target.classList.add("shake");

    window.setTimeout(() => target.classList.remove("shake"), 280);
  };

  window.setInterval(() => {
    shakeContainer();
  }, 1200 + Math.random() * 1000);

  window.setTimeout(shakeContainer, 450);
}

function gradualChange(v, tv, delay, cb, mode) {
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
      data.time = Date.now() - startTime;
      const testEl = document.querySelector("#test");
      if (testEl) testEl.innerHTML = v;
      if (cb) cb();
      if (v >= tv && mode === "i" || v <= tv && mode === "d") {
        clearInterval(start);
        // 2. Use resolve() instead of return to pass the data out
        resolve(data);
      }
    }, delay);
  });
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

audioTrack.play();
triggerOccasionalShakes();

const floatingTextLines = [
  { text: "bro", xOffset: 6, fontSize: "3rem" },
  { text: "glitch mode", xOffset: 28, fontSize: "3.5rem" },
  { text: "don't blink", xOffset: 50, fontSize: "4rem" },
  { text: "hacked vibes", xOffset: 70, fontSize: "3.2rem" },
  { text: "digital bleed", xOffset: 14, fontSize: "3.8rem" },
  { text: "static pulse", xOffset: 42, fontSize: "2.9rem" },
  { text: "about me", xOffset: 14, fontSize: "3.8rem" },
  { text: "all is good", xOffset: 42, fontSize: "2.9rem" },
  { text: "contact", xOffset: 42, fontSize: "2.9rem" },
];

const heroLines = [
  { tag: "h1", text: "WHO AM I?", fontSize: "2.4rem" },
  { tag: "h3", text: "Just your everyday developer with a passion for creating amazing web experiences.", fontSize: "1.2rem" },
  { tag: "p", text: "I build glitchy interfaces, broken code art, and immersive digital atmospheres.", fontSize: "1rem" },
  { tag: "p", text: "Need help? Get in touch!", fontSize: "0.95rem" },
  { tag: "h1", text: "CONTACTS", fontSize: "2.2rem" },
  { tag: "p", text: "Email: ifwmymoney@gmail.com", fontSize: "0.95rem" },
  { tag: "p", text: "GitHub: github.com/mannymaniken", fontSize: "0.95rem" },
  { tag: "p", text: "Discord: Manny#4DaWIN", fontSize: "0.95rem" },
];

function createFloatingText(config) {
  const floatingContainer = makeElem("div", "", {
    class: "floating-text",
    "data-text": config.text,
  });
  floatingContainer.style.left = `${config.xOffset}%`;
  floatingContainer.style.fontSize = config.fontSize;
  floatingContainer.style.animationDelay = `${config.delayOffset || 0}s`;
  floatingContainer.style.animationDuration = `${12 + Math.random() * 4}s`;
  floatingContainer.style.opacity = 0.2 + Math.random() * 0.25;
  document.querySelector(".floating-messages").appendChild(floatingContainer);
  animateFloatingText(floatingContainer, config.text);
}

function animateFloatingText(target, text) {
  const chars = Array.from(text);
  let index = 0;
  target.textContent = "";

  function step() {
    if (index < chars.length) {
      target.textContent += chars[index++];
      setTimeout(step, 80 + Math.random() * 60);
    } else {
      setTimeout(() => {
        index = 0;
        target.textContent = "";
        setTimeout(step, 200 + Math.random() * 400);
      }, 1200 + Math.random() * 1800);
    }
  }

  step();
}

function spawnFloatingMessages() {
  floatingTextLines.forEach((config, index) => {
    createFloatingText({
      ...config,
      delayOffset: index * 1.1,
    });
  });
}

function createHeroContent() {
  heroLines.forEach((line, index) => {
    const element = makeElem(line.tag, "", {
      class: "hero-line",
      "data-text": line.text,
    });
    element.style.fontSize = line.fontSize;
    element.style.opacity = 0;
    heroElement.appendChild(element);
    setTimeout(() => {
      element.style.opacity = 1;
      typeWriteLoop(element, line.text, 45, 4500 + index * 600);
    }, 700 + index * 400);
  });
}

function typeWriteLoop(target, text, delay, repeatDelay) {
  typeWrite(target, text, delay, () => {
    setTimeout(() => {
      typeWriteLoop(target, text, delay, repeatDelay);
    }, repeatDelay);
  });
}

spawnFloatingMessages();
createHeroContent();

// 3. Now this works because gradualChange returns a Promise
gradualChangeA(0, 100, 300, null, "i", audioTrack).then(data => {
  console.log(data);
});