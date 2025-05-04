import { initCars, initBookings } from './get-data.js';
import { renderCars } from "./render-cars-cards.js";

    let bookings = []
    let cars = [];

    async function getCars() {
    const data = await initCars();
    cars = [...data];
    return cars;
    }


    async function getBookings() {
        const data = await initBookings();
        bookings = data;
        return bookings;
    }

    getBookings()
    getCars()



  async function loadSearchResult() {
        const searchIds = JSON.parse(sessionStorage.getItem("serachResult")) || []
        if(searchIds) {
            const matchedCars = cars.filter(car => searchIds.includes(car.id));
            renderCars(matchedCars);
        }
  }
  


  if (
    window.location.href.includes('Search-result.html') ||
    window.location.href.includes('search-result.html')
  ) {
    (async function () {
      await getCars();
      await getBookings();
      loadSearchResult();
    })();
  }








export function homeSearch() {
  const picupDateInput = document.getElementById("pickupDateHome");
  const returnDateInput = document.getElementById("returnDateHome");
  const err = document.getElementById("errorSearch");

  const pickupDate = new Date(picupDateInput.value);
  const returnDate = new Date(returnDateInput.value);

  const availableCarIds = [];
  const bookedCarIds = [];

  if (!picupDateInput.value || !returnDateInput.value) { 
    err.innerHTML = "Please fill the data"
    return}

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickupDate < today || returnDate < today || returnDate < pickupDate) {
    err.innerHTML = "Dates must start from today or later and Return date cannot be earlier than pickup date "
    return;
  }


  bookings.forEach(book => {
    const bookedStart = new Date(book.pickupDate);
    const bookedEnd = new Date(book.returnDate);

    const noConflict = returnDate < bookedStart || pickupDate > bookedEnd;
    if (book.carId == null) {
    } else {
    if (noConflict) {
        availableCarIds.push(book.carId);
    } else {
        bookedCarIds.push(book.carId); 
    }}
  });
    const searchResult =  availableCarIds.filter(id => !bookedCarIds.includes(id));
    const resultIDS = new Set(searchResult)
        if([...resultIDS].length == 0 ) {
            err.innerHTML = "All Cars Are Booked in this Date ... Please Choose another Date"
            return
        }
        
    sessionStorage.setItem("serachResult", JSON.stringify([...resultIDS]))
    window.location.href = 'search-result.html'
}




    