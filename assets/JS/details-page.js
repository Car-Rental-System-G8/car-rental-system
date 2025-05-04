import { initCars, initBookings, initUsers } from "./get-data.js";
import { renderCar } from "./render-car-data.js";
import { renderCars } from "./render-cars-cards.js";

async function loadDetailsPage() {
  const cars = await initCars();
  const bookings = await initBookings();
  const users = await initUsers();
  const urlParams = new URLSearchParams(window.location.search);
  const carId = parseInt(urlParams.get("id"));
  const userMail = JSON.parse(localStorage.getItem("currentUser"));
  let userId;
  if (userMail) {
    const user = users.find((user) => userMail === user.email);
    userId = user.id;
  }
  if (carId) {
    const car = cars.find((car) => parseInt(car.id) === carId);
    if (car) {
      renderReviews(car.reviews, users);
      const topRatedCars = getTopRatedCars(cars, car);
      renderCars(topRatedCars);
      renderCar(car, cars, bookings);
      renderReviewPopup(car.id, userId, car.reviews);
    } else {
      console.error("Car not found");
    }
  } else {
    console.error("No car ID provided in the URL");
  }
}

export { loadDetailsPage };



// get reviews and show them 
function renderReviews(reviews, users) {
  const reviewsContainer = document.getElementById("reviews");

  if (!reviews.length) {
    reviewsContainer.innerHTML = `
      <div class="p-4 bg-light text-center rounded">
        No reviews yet.
      </div>
    `;
    return;
  }

  const reviewHTML = reviews
    .map((review) => {
      const user = users.find(
        (u) => parseInt(u.id) === parseInt(review.userId)
      );
      const userName = user?.name || "Unknown User";
      const userImg = user?.images || "/assets/images/others/profile.png";
      let stars = "";
      for (let i = 0; i < review.rating; i++) {
        stars += '<i class="fa-solid fa-star text-warning"></i>';
      }

      return `
      <div class="box-styles p-3 mb-3 shadow-sm">
        <div class="d-flex align-items-center mb-2">
          <img src="${userImg}" alt="${userName}" class=" rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
          <div>
            <h6 class="mb-0 fw-bold">${userName}</h6>
            <div class="text-warning fs-5">${stars}</div>
            <p class="mb-0 text-secondary">${review.comment}</p>
          </div>
        </div>
      </div>
    `;
    })
    .join(" ");

  reviewsContainer.innerHTML = reviewHTML;
}


// get Recommended Cars exept for the one apears in page 
function getTopRatedCars(cars, notThisCar) {
  let carsToShow = cars.filter((car) => car !== notThisCar);
  let avilable = carsToShow.filter((car) => car.availability === true) || [];
  return avilable.sort((a, b) => b.rating - a.rating).slice(0, 4);
}

function renderReviewPopup(carId, userId, lastReviews) {
  const popup = document.getElementById("review-popup");
  const openBtn = document.getElementById("open-review-popup");
  const closeBtn = document.querySelector(".close-popup");
  const form = document.getElementById("review-form");
  openBtn.addEventListener("click", function () {
    popup.style.display = "block";
  });
  closeBtn.addEventListener("click", function () {
    popup.style.display = "none";
  });
  window.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitHandler(carId, userId, lastReviews);
  });
}

async function submitHandler(carId, userId, lastReviews) {
  const rating = document.querySelector('input[name="rating"]:checked');
  const popup = document.getElementById("review-popup");
  const reviewText = document.getElementById("popup-review-msg").value;
  const error = document.getElementById("review-error-message");
  if (!rating) {
    error.style.display = "block";
    return;
  }
  const updatedReviews = [
    ...lastReviews,
    {
      userId: userId ? userId : "unknown",
      comment: reviewText,
      rating: rating.value,
    },
  ];
  const response = await addNewReview(carId, updatedReviews);
  if (response.success) {
    Swal.fire({
      title: "Success!",
      text: "Your review has been sent successfully.",
      icon: "success",
      confirmButtonColor: "#28a745",
      timer: 3000,
      timerProgressBar: true,
    });
    popup.style.display = "none";
    // return;
  }

  document.getElementById("popup-review-msg").value = "";
  error.style.display = "none";
  document.querySelectorAll('input[name="rating"]').forEach((input) => {
    input.checked = false;
  });
  document.querySelectorAll(".star-rating label").forEach((label) => {
    label.style.color = "#ccc";
  });
}

// api add review
async function addNewReview(carId, newReviews) {
  try {
    const res = await fetch(`http://localhost:3000/cars/${carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews: newReviews }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return { success: true, data: await res.json() };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
}
