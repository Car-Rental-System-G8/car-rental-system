import { addCarForm, displayCars, getCars } from "./modules/handleCars.js";

window.addEventListener("load", async () => {
  addCarForm();
  const carsData = await getCars();
  displayCars(carsData, true);
});