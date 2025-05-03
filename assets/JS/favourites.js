import { renderCars } from "./render-cars-cards.js";

async function loadfavourites() {

    if(sessionStorage.getItem("favourites")) {
        const favourites = JSON.parse(sessionStorage.getItem("favourites"));
        renderCars(favourites); 
        checkFavourite()
    }
}

loadfavourites();


// favourites function

export function addToFavourites(ele, carsData, id) {

    let favourites = JSON.parse(sessionStorage.getItem("favourites")) || [];
    const existingCar = favourites.find(car => parseInt(car.id) == parseInt(id));    
    
    if (existingCar) {
      favourites = favourites.filter(car => car.id != id);
      sessionStorage.setItem("favourites", JSON.stringify(favourites));
      $(ele).removeClass('text-danger');
      updateFavouriteCount();
      if (window.location.pathname.includes("favourite-cars.html")) {
        renderCars(favourites); 
      }
      return;
    }
    
    const addedCar = carsData.find(car => car.id == id);
    if (!addedCar) return;
  
    favourites.push(addedCar);
    sessionStorage.setItem("favourites", JSON.stringify(favourites));
    $(ele).addClass('text-danger heartbeat');
    setTimeout(() => $(ele).removeClass('heartbeat'), 300);
    updateFavouriteCount();
  }
  
  export function checkFavourite() {
    const favourites = JSON.parse(sessionStorage.getItem("favourites")) || [];
    favourites.forEach(car => {
      const favIcons = document.querySelectorAll(`.fav${car.id}`);
      favIcons?.forEach(fav => fav.classList.add('text-danger'));
    });
  }
  

  export function updateFavouriteCount() {
    const favourites = JSON.parse(sessionStorage.getItem("favourites")) || [];
    const favCounter = document.querySelector("#favourite-count"); 
    if (favCounter) favCounter.textContent = favourites.length;
  }
  