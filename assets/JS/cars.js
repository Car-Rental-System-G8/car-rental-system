import { addCarForm, displayCars, getCars } from "./modules/carManager.js";
import { addCarForm, displayCars, getCars } from "./modules/carManager.js";

window.addEventListener("load", async () => {
  addCarForm();
  const carsData = await getCars();
  displayCars(carsData, { inDashboard: true, });
});