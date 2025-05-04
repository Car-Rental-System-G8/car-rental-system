import { initCars } from './get-data.js';
import { renderCars } from "./render-cars-cards.js";

async function loadTrendingSection() {
    const cars = await initCars();
    getTopRatedCars(cars);
    const topRatedCars = getTopRatedCars(cars);
    console.log('topRatedCars:', topRatedCars);
    renderCars(topRatedCars);
}

export { loadTrendingSection };

function getTopRatedCars(cars, ) {
    let avilable = cars.filter(car => car.availability === true) || [];
    return avilable
      .sort((a, b) => b.rating - a.rating) 
      .slice(0, 4); 
}
