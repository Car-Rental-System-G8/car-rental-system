import { renderCars } from "./renderCarCards.js";


    

async function loadfavourites() {

    if(sessionStorage.getItem("favourites")) {
        const favourites = JSON.parse(sessionStorage.getItem("favourites"));
        renderCars(favourites); 
        
        favourites.forEach(car => {
            
            const favIcon = document.querySelector(`.fav${car.id}`);
            console.log(`hi${favIcon}`);
            if (favIcon) {
              console.log(`hi${favIcon}`);
              favIcon.classList.add('text-danger');
            }
        })


        console.log('favourites:', favourites);
    }
  

}
loadfavourites();

