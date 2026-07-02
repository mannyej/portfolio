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



export { addChild, makeElem, selectE }