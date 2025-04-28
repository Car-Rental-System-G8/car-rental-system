import { addCarForm, displayCars, getAvaliableCarsLength, getCars, getCarsLength } from "./modules/carManager.js";

window.addEventListener("load", async () => {
  addCarForm();
  const carsData = await getCars();
  displayCars(carsData, { inDashboard: true });
});