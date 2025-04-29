import { initCars } from './getCarsData.js';

async function loadDetailsPage() {
  const cars = await initCars();
  const urlParams = new URLSearchParams(window.location.search);
  const carId = parseInt(urlParams.get("id"));

  if (carId) {
    const car = cars.find(car => parseInt(car.id) === carId);
    if (car) {
      console.log('Car Details:', car);
    } else {
      console.error('Car not found');
    }
  } else {
    console.error('No car ID provided in the URL');
  }
}

export { loadDetailsPage };
