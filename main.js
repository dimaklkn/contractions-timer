//Set main Variables
let startTimer;
let gapTimer;
let startingTime;
let startingGapTime;
let elapsedTime = 0;
let elapsedGapTime = 0;
let gapBetween;
// html elements variables
const timerButton = document.querySelector(".timer__button");
const display = document.querySelector(".timer__counter");
const gapDisplay = document.querySelector(".timer__since-contractions");
const contractionsList = document.querySelector(".timer__results");

const contractions = [];

// run code

//Event listners
timerButton.addEventListener("click", () => {
  toggleTimer();
  toggleGapTimer();
  toggleButton();
});

// *********************
// FUNCTIONS ***********
// *********************

//toggleTimer
function toggleTimer() {
  if (!startTimer) {
    startTimerFunc();
  } else {
    stopTimerFunc();
  }
}

function toggleGapTimer() {
  if (contractions.length > 0) {
    if (!gapTimer) {
      startGapTimerFunc();
    } else {
      stopGapTimerFunc();
    }
  } else {
    return;
  }
}

// update display with an actual time
function updateDisplay() {
  const elapsedSeconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = elapsedSeconds % 60;
  display.textContent = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateGapDisplay() {
  const elapsedSeconds = Math.floor(elapsedGapTime / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  gapDisplay.textContent = `${minutes.toString().padStart(2, "0")} min ${seconds
    .toString()
    .padStart(2, "0")} sec`;
}

//toggle button name (start/stop)
function toggleButton() {
  timerButton.classList.toggle("start");
  let buttonText = timerButton.textContent;
  if (buttonText === "Start timing") {
    timerButton.textContent = "Stop";
  } else {
    timerButton.textContent = "Start timing";
  }
}

// Start, stop and reset timer
function startTimerFunc() {
  startingTime = new Date().getTime();
  startTimer = setInterval(() => {
    elapsedTime = new Date().getTime() - startingTime;
    updateDisplay();
  }, 1000);
}

function startGapTimerFunc() {
  startingGapTime = Date.now();
  gapTimer = setInterval(() => {
    elapsedGapTime = Date.now() - startingGapTime;
    updateGapDisplay();
  }, 1000);
}

function stopTimerFunc() {
  addContraction();
  //clear interval
  clearInterval(startTimer);
  startTimer = null;
  startingTime = new Date().getTime();
  elapsedTime = new Date().getTime() - startingTime;
  updateDisplay();
  addContractionToList();
}

function stopGapTimerFunc() {
  clearInterval(gapTimer);
  gapTimer = null;
  startingGapTime = Date.now();
  elapsedGapTime = Date.now() - startingGapTime;
  updateGapDisplay();
}

// add new event to contractions array
function addContraction() {
  const eventObj = {};
  eventObj.timelenght = elapsedTime;
  eventObj.endTime = Date.now();
  eventObj.startTime = eventObj.endTime - elapsedTime;
  contractions.push(eventObj);
  console.log(contractions);
}

//add new contraction to the <ul>
function addContractionToList() {
  // extract contraction data
  const lastContractionObject = contractions[contractions.length - 1];
  const { timelenght, endTime, startTime } = lastContractionObject;

  // calc the length of the contraction
  const lengthOfContraction = Math.floor(timelenght / 1000);

  // calc time between contractions
  let timeApartMin = 0;
  let timeApartSec = 0;
  if (contractions.length > 1) {
    const prevEndTime = contractions[contractions.length - 2].endTime;
    const timeApartRaw = startTime - prevEndTime;
    const timeApartSecRaw = Math.floor(timeApartRaw / 1000);
    timeApartMin = Math.floor(timeApartSecRaw / 60);
    timeApartSec = timeApartSecRaw % 60;
  }

  // calc start adn end time
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  const startHours = startTimeDate.getHours();
  const startMinutes = startTimeDate.getMinutes();
  const endHours = endTimeDate.getHours();
  const endMinutes = endTimeDate.getMinutes();

  // create row in the table
  const tableRow = document.createElement("tr");
  const indexOfObj = contractions.indexOf(lastContractionObject);

  if (isOdd(indexOfObj)) {
    tableRow.dataset.bg = "gray";
  }

  // create cell in the row
  const lengthCell = document.createElement("td");
  const timeApartCell = document.createElement("td");
  const timeStampCell = document.createElement("td");

  // add data to cells
  lengthCell.textContent = `${lengthOfContraction}s`;
  timeApartCell.textContent = `${timeApartMin
    .toString()
    .padStart(2, "0")} min ${timeApartSec.toString().padStart(2, "0")} sec`;
  timeStampCell.textContent = `${startHours
    .toString()
    .padStart(2, "0")}:${startMinutes.toString().padStart(2, "0")} - ${endHours
    .toString()
    .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

  // append all the childes to their parents
  contractionsList.appendChild(tableRow);
  tableRow.appendChild(lengthCell);
  tableRow.appendChild(timeApartCell);
  tableRow.appendChild(timeStampCell);
}

function isOdd(number) {
  return number % 2 !== 0;
}
