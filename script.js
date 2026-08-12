import { loadMap } from "./map.js";
let timeDiff = 0;
let skyTime = new Date();
let selectedTimezone = "UTC";
let backgroundTheme = localStorage.getItem("backgroundTheme")
  ? localStorage.getItem("backgroundTheme")
  : "dayAndNight";
let timeLocale = localStorage.getItem("timeLocale")
  ? localStorage.getItem("timeLocale")
  : "24hrs";
let skyColors;
let sunMoonColors;
let sunPositions;

export function getTimezoneOffsetMs(timeZone, date = new Date()) {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(date);
    const map = {};
    for (const part of parts) {
      if (part.type !== "literal") map[part.type] = part.value;
    }
    let hour = parseInt(map.hour, 10);
    if (hour === 24) hour = 0;
    const wallClockAsUTC = Date.UTC(
      parseInt(map.year, 10),
      parseInt(map.month, 10) - 1,
      parseInt(map.day, 10),
      hour,
      parseInt(map.minute, 10),
      parseInt(map.second, 10),
    );
    return wallClockAsUTC - date.getTime();
  } catch (error) {
    console.error(`Wrong timezone "${timeZone}":`, error);
    return 0;
  }
}

let updateClock = function updateClock() {
  const time = new Date();
  timeDiff = getTimezoneOffsetMs(selectedTimezone, time);
  const adjustedTime = new Date(time.getTime() + timeDiff);
  let hours = adjustedTime.getUTCHours();
  const minutes = adjustedTime.getUTCMinutes();
  const seconds = adjustedTime.getUTCSeconds();
  const timeLocaleMod = timeLocale == "24hrs" ? 24 : 12;
  let timeLocaleInfo = "";
  if (timeLocale == "12hrs") {
    timeLocaleInfo = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 > 0 ? hours % 12 : 12;
  }
  const timeToString =
    String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  const secondsToString = String(seconds).padStart(2, "0");
  document.getElementById("clock").innerHTML = timeToString;
  document.getElementById("clock-seconds").innerHTML = secondsToString;
  document.getElementById("clock-am-pm").innerHTML = timeLocaleInfo;
};

function changeColoursBasedOnSkyTime() {
  const hour = skyTime.getUTCHours();
  const minute = skyTime.getUTCMinutes();
  const fraction = minute / 60;
  const CalculatedInterpolatedSkyColor = CalculateColorInterpolation(
    skyColors[hour],
    skyColors[(hour + 1) % 24],
    fraction,
  );
  const CalculatedinterpolatedSunMoonColor = CalculateColorInterpolation(
    sunMoonColors[hour],
    sunMoonColors[(hour + 1) % 24],
    fraction,
  );
  const CalculatedsunPosition = CalculateSunPosition(
    sunPositions[hour],
    sunPositions[(hour + 1) % 24],
    fraction,
  );

  document.body.style.background = `radial-gradient(${CalculatedsunPosition} ,${CalculatedinterpolatedSunMoonColor}, ${CalculatedInterpolatedSkyColor})`;
}

function adjustSkyTime(timeActual) {
  const diff = skyTime.getTime() - timeActual.getTime();

  if (Math.abs(diff) < 600000) {
    return;
  }
  if (diff < 0) {
    skyTime = new Date(skyTime.getTime() + 720000);
  } else {
    skyTime = new Date(skyTime.getTime() - 720000);
  }
}

function CalculateColorInterpolation(color1, color2, fraction) {
  const c1 = color1.match(/\d+/g).map(Number);
  const c2 = color2.match(/\d+/g).map(Number);

  const R = Math.round((c2[0] - c1[0]) * fraction + c1[0]);
  const G = Math.round((c2[1] - c1[1]) * fraction + c1[1]);
  const B = Math.round((c2[2] - c1[2]) * fraction + c1[2]);
  return "rgb(" + R + ", " + G + ", " + B + ")";
}

function CalculateSunPosition(pos1, pos2, fraction) {
  const p1 = Math.round((pos2[0] - pos1[0]) * fraction + pos1[0]);
  const p2 = Math.round((pos2[1] - pos1[1]) * fraction + pos1[1]);

  return "at " + p1 + "% " + p2 + "%";
}

setInterval(() => {
  const now = new Date();
  const adjustedNow = new Date(now.getTime() + timeDiff);
  adjustSkyTime(adjustedNow);
  changeColoursBasedOnSkyTime();
}, 100);

getBackgroundColors(backgroundTheme);
updateClock();
setInterval(updateClock, 1000);
loadMap();
addButtonEventListener();

const clockButton = document.getElementById("clock-button");
clockButton.addEventListener("mouseenter", () => {
  clockButton
    .querySelector(".minute-hand-icon-animation")
    .classList.add("animate");
  clockButton
    .querySelector(".hour-hand-icon-animation")
    .classList.add("animate");
});

clockButton.addEventListener("mouseleave", () => {
  setTimeout(() => {
    clockButton
      .querySelector(".minute-hand-icon-animation")
      .classList.remove("animate");
    clockButton
      .querySelector(".hour-hand-icon-animation")
      .classList.remove("animate");
  }, 1500);
});

function addButtonEventListener() {
  document.querySelectorAll(".menu-button").forEach((button) => {
    button.addEventListener("click", () => {
      loadPage(button.id.split("-")[0]);
    });
  });
  document.querySelectorAll(".info-more-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      button.classList.toggle("active");
      const infoMore = event.currentTarget.nextElementSibling;
      if (infoMore.style.maxHeight) {
        infoMore.style.maxHeight = null;
        button.innerHTML = button.innerHTML.replace("↑", "↓");
      } else {
        infoMore.style.maxHeight = "3000px";
        button.innerHTML = button.innerHTML.replace("↓", "↑");
      }
    });
  });
}

export function changeTimezone(timezone) {
  selectedTimezone = timezone;
  timeDiff = getTimezoneOffsetMs(selectedTimezone);
}

function loadPage(page) {
  document.getElementById("content").classList.add("change");
  setTimeout(() => {
    fetch(`subsites/${page}.html`)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("content").innerHTML = html;

        setTimeout(() => {
          document.getElementById("content").classList.remove("change");
        }, 150);

        if (page === "clock") {
          loadMap();
        } else if (page === "alt_map") {
          loadMap();
        } else if (page === "settings") {
          addOptionsButtonEventListener();
        }
        addButtonEventListener();
      })
      .catch(() => {
        document.getElementById("content").classList.remove("change");
      });
  }, 150);
}

async function getBackgroundColors(themeId) {
  try {
    const response = await fetch("backgroundThemes.json");
    const data = await response.json();
    const theme = data[themeId];
    skyColors = theme.skyColors;
    sunMoonColors = theme.sunMoonColors;
    sunPositions = theme.sunPositions;
    localStorage.setItem("backgroundTheme", themeId);
  } catch (error) {
    console.error("Błąd podczas motywu:", error);
  }
}

function addOptionsButtonEventListener() {
  document
    .querySelectorAll(".settings-background-color-option")
    .forEach((div) => {
      div.addEventListener("click", () => {
        getBackgroundColors(div.id);
      });
    });
  document.querySelectorAll(".settings-hour-locale-option").forEach((div) => {
    div.addEventListener("click", () => {
      localStorage.setItem("timeLocale", div.id);
      timeLocale = div.id;
    });
  });
}
