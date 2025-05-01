const mainContent = document.getElementById("main-content");

getUserBooking();

async function getUserBooking() {
  const userMail = JSON.parse(localStorage.getItem("currentUser"));
  if (userMail) {
    const users = await getUsers();
    const user = users.find((u) => u.email === userMail);
    if (user) {
      const bookings = await getBookings();
      const userBookings = bookings.filter(
        (booking) => booking.userId === user.id
      );
      displayBookingHistory(userBookings);
    }
  } else {
    displayNotLogin();
  }
}

async function displayBookingHistory(bookings) {
  if (bookings.length === 0) {
    displayNoHistory();
  } else {
    const bookingWrapper = document.createElement("div");
    bookingWrapper.classList.add("row", "gy-3");
    const cars = await getCars();
    bookings.forEach((booking) => {
      const car = cars.filter((car) => car.id === booking.carId)[0];
      bookingWrapper.append(createBookingCard(booking, car));
    });
    mainContent.appendChild(bookingWrapper);
  }
}

function createBookingCard(booking, car) {
  const bookingCard = document.createElement("div");
  bookingCard.classList.add("card");
  bookingCard.classList.add("rounded");
  bookingCard.innerHTML = `
            <div class="row align-items-center p-3 flex-md-row flex-column">
              <div class="col-md-3">
                <a href="#"
                  ><img src="${car.image}" alt="${car.brand} ${car.model} photo" class="img-fluid"
                /></a>
              </div>
              <div class="col-md-7 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-center d-md-block">
                    <h2>${car.brand} ${car.model}</h2>
                    <p >${car.year} - ${car.type}</p>
                </div>
                <p><strong>${car.pricePerDay} EGP/Day</strong></p>
                <p class="star-rating">${Array(5)
                  .fill()
                  .map(
                    (_, i) =>
                      `<i class="fa-solid fa-star ${
                        i < Math.round(car.rating)
                          ? "text-warning"
                          : "text-secondary"
                      }"></i>`
                  )
                  .join("")}
                </p>
                </div>
                <div class="col-md-2 d-flex flex-column justify-content-between gap-2">
                <div class="d-flex justify-content-between align-items-center d-md-block">
                    <p><strong>From:</strong> ${dateFormatter(
                      booking.pickupDate
                    )}</p>
                    <p><strong>To:</strong> ${dateFormatter(
                      booking.returnDate
                    )}</p>
                </div>
                <strong>Total Price ${getTotalPrice(
                  booking.pickupDate,
                  booking.returnDate,
                  car.pricePerDay
                )} EGP</strong>
                <button class="btn"><a href="./" class="text-white text-decoration-none">Rent Again</a></button>
              </div>
            </div>`;
  // edit img link to car details
  return bookingCard;
}

function displayNoHistory() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="row justify-content-center align-items-center">
        <div
          class="card text-center p-4 col-10 col-md-6"
        >
          <h3>No Bookings Yet</h3>
          <p >
            You haven't rented any cars with us before. Ready for your first
            adventure?
          </p>
          <button class="btn my-4 py-2 px-4 m-auto">
            <a href="#" class="text-white text-decoration-none"
              >Rent Your First Car Now</a
            >
          </button>
          </div>`;
  //   will edit link target
  mainContent.appendChild(wrapper);
}

function displayNotLogin() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
  <div class="row justify-content-center align-items-center">
        <div
          class="card text-center p-4 col-10 col-md-6"
        >
        <h3>You must login first</h3>
        <button class="btn my-4 py-2 px-4 m-auto">
        <a href="#" class="text-white text-decoration-none"
        >Login</a
        >
        </button>
        <div>
        `;
  //   will edit link target
  mainContent.appendChild(wrapper);
}


// helper functions
async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    return users;
  } catch (error) {
    console.log(error);
    // sweet alert
  }
}

async function getBookings() {
  try {
    const response = await fetch("http://localhost:3000/bookings");
    const bookings = await response.json();
    return bookings;
  } catch (error) {
    console.log(error);
    // sweet alert
  }
}

async function getCars() {
  try {
    const response = await fetch("http://localhost:3000/cars");
    const cars = await response.json();
    return cars;
  } catch (error) {
    console.log(error);
    // sweet alert
  }
}

function dateFormatter(date) {
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Invalid Date"
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function getTotalPrice(pickupDate, returnDate, pricePerDay) {
  const startDate = new Date(pickupDate);
  const endDate = new Date(returnDate);
  const timeDifference = endDate - startDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference * pricePerDay;
}
