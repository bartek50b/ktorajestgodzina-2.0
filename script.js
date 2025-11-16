import { skyColors, sunMoonColors, sunPositions } from "./data.js";
import { loadMap } from "./map.js";
let timeDiff = 0;
let skyTime = new Date();

let updateClock = function updateClock() {
  const time = new Date();
  const adjustedTime = new Date(time.getTime() + timeDiff);
  const hours = adjustedTime.getUTCHours();
  const minutes = adjustedTime.getUTCMinutes();
  const seconds = adjustedTime.getUTCSeconds();

  const timeToString =
    String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  const secondsToString = String(seconds).padStart(2, "0");
  document.getElementById("clock").innerHTML = timeToString;
  document.getElementById("clock-seconds").innerHTML = secondsToString;
};

function changeColoursBasedOnSkyTime() {
  const hour = skyTime.getUTCHours();
  const minute = skyTime.getUTCMinutes();
  const fraction = minute / 60;
  const CalculatedInterpolatedSkyColor = CalculateColorInterpolation(
    skyColors[hour],
    skyColors[(hour + 1) % 24],
    fraction
  );
  const CalculatedinterpolatedSunMoonColor = CalculateColorInterpolation(
    sunMoonColors[hour],
    sunMoonColors[(hour + 1) % 24],
    fraction
  );
  const CalculatedsunPosition = CalculateSunPosition(
    sunPositions[hour],
    sunPositions[(hour + 1) % 24],
    fraction
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

updateClock();
setInterval(updateClock, 1000);
loadMap();

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

document.querySelectorAll(".menu-button").forEach((button) => {
  button.addEventListener("click", () => {
    loadPage(button.id.split("-")[0]);
  });
});

export function changeTimezone(timezone) {
  const plusMinus = timezone[4] == "p" ? 1 : -1;
  console.log(timezone[8]);
  if (timezone.length == 6) {
    timeDiff = plusMinus * 3600000 * timezone[5];
  } else if (timezone.length == 7) {
    console.log(timezone[6] + 10);
    timeDiff = plusMinus * 3600000 * (parseInt(timezone[6]) + 10);
  } else if (timezone[7] == 3) {
    timeDiff = plusMinus * 3600000 * (parseInt(timezone[5]) + 0.5);
    console.log("succ");
  } else if (timezone[7] == 4) {
    ////0.45
    timeDiff = plusMinus * 3600000 * (parseInt(timezone[5]) + 0.75);
  } else {
    timeDiff = 0;
  }
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
        }
      })
      .catch(() => {
        document.getElementById("content").classList.remove("change");
      });
  }, 150);
}
