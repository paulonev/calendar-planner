// features of calendar: 
// 1. months and years should be choosable with scrollers - done
// 2. calendar should have weekday headers (done) and week numbers on the left
// 3. each date click should select/unselect it(change color) - done
// 4. dates should have 3 colors for number (gray, black and red) - done
// 5. when selecting period - open right panel with plan-input and other info - in progress
//    5.1. problems - selection disappears when switch options, global objects bad practice
// 6. select/unselect whole week with the click on week number

import Planner from "./planner.js";
import selectedDays from "./utils/selectedDates.js";

const DAYS_IN_WEEK = 7;
const DEFAULT_MONTH = new Date().getMonth();
const DEFAULT_YEAR = new Date().getFullYear();

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const fillParameters = {
    month: DEFAULT_MONTH,
    year: DEFAULT_YEAR
};

window.addEventListener("DOMContentLoaded", loadCalendarDataEventHandler);

function createMonthDropdown() {
    let dropdown = document.createElement("select");
    dropdown.setAttribute("class", "month-dropdown");    
    MONTHS.forEach((item) => {
        let option = document.createElement("option");
        option.value = item;
        option.text = item;
        dropdown.add(option);
    });
    dropdown.selectedIndex = DEFAULT_MONTH;
    document.querySelector(".widget__header").appendChild(dropdown);
}

function createYearDropdown() {
    let dropdown = document.createElement("select");    
    dropdown.setAttribute("class", "year-dropdown");    
    
    Array(100).fill().map((_, i) => 1970+i)
      .forEach((item) => {
        let option = document.createElement("option");
        option.value = item;
        option.text = item;
        dropdown.add(option);
    });

    dropdown.selectedIndex = DEFAULT_YEAR - 1970;
    document.querySelector(".widget__header").appendChild(dropdown);
}

export const initCalendar = () => {
    let table = document.createElement("table");
    table.setAttribute("class", "tbl");
    
    createMonthDropdown();
    createYearDropdown();
    
    const monthInput = document.querySelector(".month-dropdown");
    const yearInput = document.querySelector(".year-dropdown");
    
    monthInput.addEventListener("blur", loadCalendarDataEventHandler);
    yearInput.addEventListener("blur", loadCalendarDataEventHandler);
    
    const weekHeads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let head = document.createElement("tr");
    head.setAttribute("name", "tableHead");
    weekHeads.forEach((abbr) => {
        let cell = document.createElement("th");
        let cellText = document.createTextNode(abbr);
        cell.appendChild(cellText);
        head.appendChild(cell);
    });
    table.appendChild(head);

    let tableBody = document.createElement("tbody");
    tableBody.setAttribute("name", "tableBody");
    table.appendChild(tableBody);
        
    // insert table in DOM
    const widget = document.querySelector(".widget__calendar");
    widget.appendChild(table);
}

//event handlers
function loadCalendarDataEventHandler(event) {
    if(event.target.className === "month-dropdown") {
        fillParameters.month = MONTHS.findIndex((item) => item === event.target.value)
    }
    else if(event.target.className === "year-dropdown") {
        fillParameters.year = +(event.target.value)
    }
    fill(fillParameters);

    document.getElementsByName("calendar-item").forEach((elem) => {
        // const parsedDate = new Date(fillParameters.year, fillParameters.month, +(elem.innerText));
        const parsedDate = getParsedDate(fillParameters, elem);
        elem.addEventListener("click", dateSelectionEventHandler.bind(parsedDate));
    });
}

function dateSelectionEventHandler(event) {
    event.preventDefault();
    const selectionColor = "#0041ff";
    const targetStyle = event.target.style;
    
    if(targetStyle.background === "") {
        targetStyle.background = selectionColor;
        selectedDays.add(this); // this is parsedDate's ref
    } else {
        targetStyle.background = "";
        selectedDays.remove(this);
    }

    const planner = new Planner(selectedDays.days);
    planner.update();
}

// helpers
const fill = ({year, month}) => {
    // generate or parse data for calendar   
    // if year=2021 and month=6(July), then new Date(2021, 6, 32) returns 1 (1st of August)
    // meaning that July has 32-1=31 dates
    const datesInMonth = 32 - new Date(year, month, 32).getDate(); 
    
    let days = Array(datesInMonth).fill()
      .map((_, i) => {
        return {
          fullDate: new Date(year, month, i+1),
          selectedMonth: true
        }
    });
    
    let firstDay = (new Date(year, month, 1)).getUTCDay(); // 0-6
    let lastDay = (new Date(year, month, datesInMonth)).getUTCDay(); 
    
    const prevMonthDays = Array(32 - new Date(year, month-1, 32).getDate())
      .fill()
      .map((_, i) => {
        return {
          fullDate: new Date(year, month-1, i+1),
          selectedMonth: false
        }
    });

    days = prevMonthDays
      .slice(prevMonthDays.length-firstDay)
      .concat(days);
    
    const nextMonthDays = Array(32 - new Date(year, month+1, 32).getDate())
      .fill()
      .map((_, i) => {
        return {
          fullDate: new Date(year, month+1, i+1),
          selectedMonth: false
        }
    });
    
    // {29, false}, {30, false}, {1, true}, ..., {29, true}, {30, true}, {1, false}, 2, 3, 4
    days = days.concat(nextMonthDays.slice(0, DAYS_IN_WEEK-(lastDay+1))); 
    
    // build tbody DOM    
    let tableBody = document.getElementsByName("tableBody")[0];
    //clear previous output
    tableBody.innerHTML = "";
    
    const weekChunks = spliceIntoChunks(days, DAYS_IN_WEEK);
    for(const weekChunk of weekChunks)
    {
        let row = document.createElement("tr");
        for(const day of weekChunk) {
            let cell = document.createElement("td");
            cell.setAttribute("name", "calendar-item");
            let cellText = document.createTextNode(`${day.fullDate.getDate()}`);
            
            //for days of another months(gray color)
            if(day.selectedMonth == false) {
                cell.setAttribute("class", "unselectedMonth");
            }
            
            if(selectedDays.contains(day.fullDate)) {
                cell.style.background = "#0041ff";
            }

            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        
        const rowChildren = row.children;
        [5,6].forEach((v) => rowChildren.item(v).className += " weekend");

        tableBody.appendChild(row);
    }    
}

// utils
function spliceIntoChunks(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
}

// parse table cell to Date object
function getParsedDate(fillParameters, element) {
  // define Date object given select fields and EventTarget
  const date = +(element.innerText);
  const elementParent = element.parentNode;
  if(elementParent.previousSibling === null && date - 1 > DAYS_IN_WEEK) {
      //element is in the first row of table and it's value is > 1
      return new Date(fillParameters.year, fillParameters.month-1, date);
  }
  else if(elementParent.nextSibling === null && date < 28) {
    //element is in the last row of table and it's value is < 28
    return new Date(fillParameters.year, fillParameters.month+1, date);    
  }
  else return new Date(fillParameters.year, fillParameters.month, date);
}