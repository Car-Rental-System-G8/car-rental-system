import { initCars } from './get-data.js';
import { renderCars } from "./render-car-data.js";

async function loadListingPage() {
  const cars = await initCars();
  renderCars(cars);
}

export { loadListingPage };