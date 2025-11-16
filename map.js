import { regionToTimezone } from "./data.js";
import { changeTimezone } from "./script.js";

export function loadMap() {
  fetch("media/svg/timezones.svg")
    .then((response) => response.text())
    .then((svg) => {
      document.getElementById("map").innerHTML = svg;
      const regions = document.getElementsByClassName("o");

      let selectedRegion = localStorage.getItem("selectedRegion")
        ? localStorage.getItem("selectedRegion")
        : "pl";
      document.getElementById(selectedRegion).classList.add("chosen");
      changeTimezone(String(regionToTimezone[selectedRegion]));

      Array.from(regions).forEach((region) => {
        region.addEventListener("mouseover", () => {
          const timezone = regionToTimezone[region.id];
          if (!timezone) return;
          const sameTimezoneRegions = document.getElementsByClassName(timezone);

          Array.from(sameTimezoneRegions).forEach((sameTimezoneRegion) => {
            if (sameTimezoneRegion.id != region.id) {
              sameTimezoneRegion.classList.add("same-timezone");
            } else {
              sameTimezoneRegion.classList.add("hovered");
            }
          });
        });

        region.addEventListener("mouseout", () => {
          const timezone = regionToTimezone[region.id];
          if (!timezone) return;
          const sameTimezoneRegions = document.getElementsByClassName(timezone);

          Array.from(sameTimezoneRegions).forEach((sameTimezoneRegion) => {
            if (sameTimezoneRegion.id != region.id) {
              sameTimezoneRegion.classList.remove("same-timezone");
            } else {
              sameTimezoneRegion.classList.remove("hovered");
            }
          });
        });

        region.addEventListener("click", () => {
          const timezone = regionToTimezone[region.id];
          changeTimezone(String(timezone));
          console.log(region.id);
          Array.from(regions).forEach((r) => r.classList.remove("chosen"));
          region.classList.add("chosen");
          localStorage.setItem("selectedRegion", region.id);
        });
      });
    });
}
