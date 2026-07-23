import { createHero3DProjectList } from "../src/index";
import "../style.css";

const hero = document.getElementById("heroDemo") as HTMLElement | null;
const shiftRange = document.getElementById(
  "shiftRange",
) as HTMLInputElement | null;
const densityRange = document.getElementById(
  "densityRange",
) as HTMLInputElement | null;
const angleXRange = document.getElementById(
  "angleXRange",
) as HTMLInputElement | null;
const angleYRange = document.getElementById(
  "angleYRange",
) as HTMLInputElement | null;
const angleZRange = document.getElementById(
  "angleZRange",
) as HTMLInputElement | null;
const mouseDynamicToggle = document.getElementById(
  "mouseDynamicToggle",
) as HTMLInputElement | null;

const shiftText = document.getElementById("shiftText");
const densityText = document.getElementById("densityText");
const angleXText = document.getElementById("angleXText");
const angleYText = document.getElementById("angleYText");
const angleZText = document.getElementById("angleZText");

const items = [
  {
    image: "./images/scene-1.svg",
    href: "#",
  },
  {
    image: "./images/scene-2.svg",
    href: "#",
  },
  {
    image: "./images/scene-3.svg",
    href: "#",
  },
  {
    image: "./images/scene-4.svg",
    href: "#",
  },
  {
    image: "./images/scene-5.svg",
    href: "#",
  },
  {
    image: "./images/scene-6.svg",
    href: "#",
  },
];

if (
  !hero ||
  !shiftRange ||
  !densityRange ||
  !angleXRange ||
  !angleYRange ||
  !angleZRange ||
  !mouseDynamicToggle ||
  !shiftText ||
  !densityText ||
  !angleXText ||
  !angleYText ||
  !angleZText
) {
  throw new Error("Demo initialization failed: missing required DOM nodes.");
}

const instance = createHero3DProjectList(hero, {
  items,
  hoverRotate: 0,
  hoverShift: Number(shiftRange.value),
  density: Number(densityRange.value),
  baseAngles: {
    x: Number(angleXRange.value),
    y: Number(angleYRange.value),
    z: Number(angleZRange.value),
  },
  enableMouseDynamic: mouseDynamicToggle.checked,
  transitionMs: 300,
  cardAspectRatio: "16 / 9",
});

const syncValues = (): void => {
  shiftText.textContent = shiftRange.value;
  densityText.textContent = Number(densityRange.value).toFixed(2);
  angleXText.textContent = angleXRange.value;
  angleYText.textContent = angleYRange.value;
  angleZText.textContent = angleZRange.value;

  instance.update({
    hoverRotate: 0,
    hoverShift: Number(shiftRange.value),
    density: Number(densityRange.value),
    baseAngles: {
      x: Number(angleXRange.value),
      y: Number(angleYRange.value),
      z: Number(angleZRange.value),
    },
    enableMouseDynamic: mouseDynamicToggle.checked,
  });
};

shiftRange.addEventListener("input", syncValues);
densityRange.addEventListener("input", syncValues);
angleXRange.addEventListener("input", syncValues);
angleYRange.addEventListener("input", syncValues);
angleZRange.addEventListener("input", syncValues);
mouseDynamicToggle.addEventListener("change", syncValues);

syncValues();
