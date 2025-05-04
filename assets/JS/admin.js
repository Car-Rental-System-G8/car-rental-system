import { getAvaliableCarsLength, getCarsLength } from "./modules/carManager.js";
import { fetchData } from "./modules/fetchData.js";

if (window.toastr) {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "newestOnTop": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
}

// Dashboard Stats
window.addEventListener("load", async () => {
  const allCarsStat = document.getElementById("allCars");
  const avaliableCars = document.getElementById("avaliableCars");
  const bookingCars = document.getElementById("bookingCars");
  const totalProfit = document.getElementById("totalProfit");

  if (allCarsStat) {
    const carsLength = await getCarsLength();
    allCarsStat.textContent = carsLength;
  }

  if (avaliableCars) {
    const carsLength = await getAvaliableCarsLength();
    avaliableCars.textContent = carsLength;
  }

  if (totalProfit) {
    const getCarsBookings = await fetchData("http://localhost:3000/bookings");
    const confirmedBookings = getCarsBookings.filter(booking => booking.status === "confirmed");
    const totalConfirmedCost = confirmedBookings.reduce((total, booking) => total + booking.totalCost, 0);
    
    totalProfit.textContent = `${totalConfirmedCost}$`;
    bookingCars.textContent = getCarsBookings.length;
  }
});
