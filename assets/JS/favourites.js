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
  const currentUserEmail = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUserEmail) {
    updateUserFavourites(id)
  };
    let favourites = JSON.parse(sessionStorage.getItem("favourites")) || [];
    const existingCar = favourites.find(car => parseInt(car.id) == parseInt(id));    
    
    if (existingCar) {
      favourites = favourites.filter(car => car.id != id);
      sessionStorage.setItem("favourites", JSON.stringify(favourites));
      updateFavouriteCount();
      $(ele).removeClass('text-danger');
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
  




// Update user favourites in the database
async function updateUserFavourites(carId) {
  const currentUserEmail = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUserEmail) return;

  try {
    const res = await fetch(`http://localhost:3000/users?email=${currentUserEmail}`);
    const users = await res.json();
    const user = users[0];
    if (!user) return;

    let  updatedFavourites = [...(user.favourites || [])];
    const carIndex = updatedFavourites.indexOf(carId);

  if (carIndex === -1) {
      updatedFavourites.push(carId);
    } else {
      updatedFavourites = updatedFavourites.filter(favId => favId !== carId);
    }

  await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favourites: updatedFavourites })
    });
  } catch (error) {
    console.error("Error updating user favourites:", error);
  }
}

// load favourites in log in
export async function loadUserFavourites() {
  const userEmail = JSON.parse(localStorage.getItem("currentUser"));
  if (!userEmail) return;
  try {
    // Get user by email
    const userRes = await fetch(`http://localhost:3000/users?email=${userEmail}`);
    const users = await userRes.json();
    const user = users[0];
    if (!user || !user.favourites || user.favourites.length === 0) return;

    const favIds = user.favourites.map(id => id.toString());

    // Get all cars
    const carsRes = await fetch("http://localhost:3000/cars");
    const carsData = await carsRes.json();

    // Filter only favourite cars
    const favCars = carsData.filter(car => favIds.includes(car.id.toString()));

    // Save to sessionStorage (to reuse same logic)
    sessionStorage.setItem("favourites", JSON.stringify(favCars));

    // Render to page (if inside fav page)
    if (window.location.pathname.includes("favourite-cars.html")) {
      renderCars(favCars);
    }

  } catch (error) {
    console.error("Error loading favourites:", error);
  }
}
