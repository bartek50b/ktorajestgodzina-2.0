const skyColors = [
  "rgb(2, 7, 24)",
  "rgb(3, 10, 31)",
  "rgb(5, 13, 39)",
  "rgb(7, 16, 48)",
  "rgb(9, 21, 60)",
  "rgb(20, 38, 73)",
  "rgb(39, 74, 114)",
  "rgb(60, 109, 154)",
  "rgb(79, 134, 181)",
  "rgb(93, 147, 192)",
  "rgb(107, 160, 203)",
  "rgb(119, 169, 209)",
  "rgb(130, 178, 215)",
  "rgb(127, 175, 220)",
  "rgb(123, 172, 223)",
  "rgb(118, 168, 224)",
  "rgb(106, 156, 219)",
  "rgb(91, 139, 207)",
  "rgb(71, 111, 180)",
  "rgb(53, 78, 131)",
  "rgb(40, 52, 90)",
  "rgb(27, 34, 58)",
  "rgb(16, 20, 38)",
  "rgb(6, 8, 20)",
];

const sunMoonColors = [
  "rgb(191, 201, 255)",
  "rgb(195, 204, 255)",
  "rgb(199, 208, 255)",
  "rgb(203, 211, 255)",
  "rgb(208, 215, 255)",
  "rgb(247, 194, 122)",
  "rgb(255, 193, 90)",
  "rgb(255, 208, 102)",
  "rgb(255, 221, 115)",
  "rgb(255, 227, 122)",
  "rgb(255, 232, 129)",
  "rgb(255, 235, 133)",
  "rgb(255, 240, 140)",
  "rgb(255, 233, 128)",
  "rgb(255, 223, 114)",
  "rgb(255, 210, 97)",
  "rgb(255, 193, 82)",
  "rgb(255, 173, 71)",
  "rgb(255, 154, 74)",
  "rgb(231, 197, 255)",
  "rgb(217, 201, 255)",
  "rgb(207, 205, 255)",
  "rgb(197, 209, 255)",
  "rgb(186, 198, 255)",
];

const sunPositions = [
  [95, 90],
  [92, 88],
  [88, 85],
  [84, 82],
  [80, 78],
  [76, 70],
  [72, 60],
  [68, 45],
  [64, 30],
  [60, 18],
  [55, 8],
  [52, 2],
  [50, 0],
  [48, 2],
  [44, 8],
  [40, 18],
  [36, 30],
  [32, 45],
  [28, 60],
  [24, 70],
  [20, 78],
  [14, 82],
  [8, 85],
  [4, 90],
];

function updateClock() {
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const timeToString =
    String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  const secondsToString = String(seconds).padStart(2, "0");
  document.getElementById("clock").innerHTML = timeToString;
  document.getElementById("clock-seconds").innerHTML = secondsToString;
  changeColoursBasedOnTime(hours, minutes);
}

function changeColoursBasedOnTime(hour, minute) {
  fraction = minute / 60;
  const interpolatedSkyColor = CalculateColorInterpolation(
    skyColors[hour],
    skyColors[(hour + 1) % 24],
    fraction
  );
  const interpolatedSunMoonColor = CalculateColorInterpolation(
    sunMoonColors[hour],
    sunMoonColors[(hour + 1) % 24],
    fraction
  );
  const sunPosition = CalculateSunPosition(
    sunPositions[hour],
    sunPositions[(hour + 1) % 24],
    fraction
  );

  document.body.style.background = `radial-gradient(${sunPosition} ,${interpolatedSunMoonColor}, ${interpolatedSkyColor})`;
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
  p1 = Math.round((pos2[0] - pos1[0]) * fraction + pos1[0]);
  p2 = Math.round((pos2[1] - pos1[1]) * fraction + pos1[1]);

  return "at " + p1 + "% " + p2 + "%";
}

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
