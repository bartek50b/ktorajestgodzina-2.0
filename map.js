import { regionToTimezone } from "./data.js";
import { changeTimezone, getTimezoneOffsetMs } from "./script.js";

let regionOffsetMs = {};
let offsetGroups = {};

function buildTimezoneGroups() {
  const now = new Date();
  const nextRegionOffsetMs = {};
  const nextOffsetGroups = {};
  for (const [regionId, timezone] of Object.entries(regionToTimezone)) {
    const offsetMs = getTimezoneOffsetMs(timezone, now);
    nextRegionOffsetMs[regionId] = offsetMs;
    if (!nextOffsetGroups[offsetMs]) nextOffsetGroups[offsetMs] = [];
    nextOffsetGroups[offsetMs].push(regionId);
  }
  regionOffsetMs = nextRegionOffsetMs;
  offsetGroups = nextOffsetGroups;
}

export function loadMap() {
  fetch("media/svg/timezones.svg")
    .then((response) => response.text())
    .then((svg) => {
      document.getElementById("map").innerHTML = svg;
      const regions = document.getElementsByClassName("o");

      buildTimezoneGroups();
      setInterval(buildTimezoneGroups, 30 * 60 * 1000);

      let selectedRegion = localStorage.getItem("selectedRegion")
        ? localStorage.getItem("selectedRegion")
        : "pl";
      document.getElementById(selectedRegion).classList.add("chosen");
      changeTimezone(String(regionToTimezone[selectedRegion]));

      Array.from(regions).forEach((region) => {
        region.addEventListener("mouseover", () => {
          if (!(region.id in regionOffsetMs)) return;
          const offsetMs = regionOffsetMs[region.id];
          const sameTimezoneRegionIds = offsetGroups[offsetMs] || [];

          sameTimezoneRegionIds.forEach((id) => {
            const sameTimezoneRegion = document.getElementById(id);
            if (!sameTimezoneRegion) return;
            if (id != region.id) {
              sameTimezoneRegion.classList.add("same-timezone");
            } else {
              sameTimezoneRegion.classList.add("hovered");
            }
          });
        });

        region.addEventListener("mouseout", () => {
          if (!(region.id in regionOffsetMs)) return;
          const offsetMs = regionOffsetMs[region.id];
          const sameTimezoneRegionIds = offsetGroups[offsetMs] || [];

          sameTimezoneRegionIds.forEach((id) => {
            const sameTimezoneRegion = document.getElementById(id);
            if (!sameTimezoneRegion) return;
            if (id != region.id) {
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
