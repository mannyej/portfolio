import { selectE } from "./elements.js"


const hourElem = document.querySelector("#date-time-hour")
const dateElem = document.querySelector("#date-date-date")

const introCover = selectE("#introCover")
const introH = document.querySelector("#introHeader")
const closeCoverbtn = selectE("#closeCover")
const batteryPercentElem = selectE("#batteryPercent")


const window_title = document.querySelector(".window-title")


export { hourElem, dateElem, window_title, introH, closeCoverbtn, introCover, batteryPercentElem }