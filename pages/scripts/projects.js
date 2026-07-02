import { projects } from "../../modules/projectData.js";
import { makeElem, addChild } from "../../modules/elements.js";

const projectGrid = document.querySelector(".project-grid")

projects.forEach((project, index) => {
    const newCard = makeElem("div", null, project.attributes)
    const projectTop = makeElem("div", null, { class: "project-topline" })
    const spanStat = makeElem("span", project.type, { class: "status" })
    const title = makeElem("h2", project.title, null)
    const desc = makeElem("p", project.description, null)
    const tagList = makeElem("div", null, { class: "tag-list" })

    project.tags.forEach(tag => {
        const newTag = makeElem("span", tag, null)
        addChild(tagList, newTag)
    })
    addChild(projectTop, spanStat)
    addChild(newCard, projectTop)
    addChild(newCard, title)
    addChild(newCard, desc)
    addChild(newCard, tagList)

    addChild(projectGrid, newCard)

})