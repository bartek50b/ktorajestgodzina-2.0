import { skyColors, sunMoonColors, sunPositions } from "./data.js";

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

const buttons = document.querySelectorAll(".menu-button");

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button
      .querySelector(".default-hover-icon-animation")
      .classList.add("animate");
    button
      .querySelector(".minute-hand-icon-animation")
      .classList.add("animate");
    button.querySelector(".hour-hand-icon-animation").classList.add("animate");
  });

  button.addEventListener("mouseleave", () => {
    setTimeout(() => {
      button
        .querySelector(".default-hover-icon-animation")
        .classList.remove("animate");
      button
        .querySelector(".minute-hand-icon-animation")
        .classList.remove("animate");
      button
        .querySelector(".hour-hand-icon-animation")
        .classList.remove("animate");
    }, 1500);
  });
});

export function changeTimezone(timezone) {
  const plusMinus = timezone[4] == "p" ? 1 : -1;
  if (timezone.length == 6) {
    timeDiff = plusMinus * 3600000 * timezone[5];
  } else if (timezone[7] == 3) {
    timeDiff = plusMinus * 3600000 * (timezone[5] + 0.5);
  } else if (timezone[7] == 4) {
    ////0.45
    timeDiff = plusMinus * 3600000 * (timezone[5] + 0.75);
  } else {
    timeDiff = 0;
  }
}
