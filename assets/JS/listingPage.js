import { initCars } from './getCarsData.js';
import { renderCars } from "./renderCarCards.js";

async function loadListingPage() {
  const cars = await initCars();
  renderCars(cars);
}

export { loadListingPage };