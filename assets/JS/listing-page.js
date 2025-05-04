import { initCars } from './get-data.js';
import { renderCars } from "./render-cars-cards.js";

async function loadListingPage() {
  const cars = await initCars();
  console.log('cars:', cars);
  renderCars(cars);
}

export { loadListingPage };