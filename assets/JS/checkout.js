import { fetchData } from "./modules/fetchData.js";
import { getCurrentUser } from "./modules/userManager.js";
// sessionStorage.setItem("cart", JSON.stringify({"carId": "1"}));
const checkoutItem = JSON.parse(sessionStorage.getItem("cart"));
console.log('checkoutItem:', checkoutItem);

const taxRate = 0.10;

const calculateDays = (pickup, dropoff) => {
  const start = new Date(pickup);
  const end = new Date(dropoff);
  const diff = end - start;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : null;
};

const showSwal = (icon, title, text, redirect = false, path = "/", buttonText = "Go to Home") => {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonText: buttonText,
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then(() => {
    if (redirect) {
      sessionStorage.removeItem("cart");
      setTimeout(() => (window.location.href = path), 100);
    }
  });
};

const toggleCheckoutVisibility = (visible) => {
  document.getElementById("checkoutContainer").classList.toggle("d-none", !visible);
};

const updateLocationDisplay = () => {
  const { address, city, country } = checkoutItem;
  const display = !!(address || city || country);
  document.getElementById("checkoutLocation").classList.toggle("d-none", !display);
  document.getElementById("rentalLocationAddress").textContent = address || "";
  document.getElementById("rentalLocationCity").textContent = city || "";
  document.getElementById("rentalLocationCountry").textContent = country || "";
};

const updatePriceDisplay = (pricePerDay, days = 1) => {
  const totalPrice = pricePerDay * days;
  const totalTax = totalPrice * taxRate;
  const finalPrice = totalPrice + totalTax;

  document.querySelector(".checkout-plan-price").textContent = `${totalPrice.toFixed(2)} EGP`;
  document.querySelector(".checkout-plan-tax").textContent = `${totalTax.toFixed(2)} EGP`;
  document.querySelector(".checkout-plan-totalprice").textContent = `${finalPrice.toFixed(2)} EGP`;

  checkoutItem.totalCost = finalPrice;
};

const handleCheckout = async () => {
  const user = await getCurrentUser();
  if (!user) return showSwal("warning", "Oops!", "Please log in to proceed with the checkout.", true, "login.html", "Go to Login");

  if (!checkoutItem || !checkoutItem.carId) {
    return showSwal("warning", "Oops!", "Please select a car before proceeding to checkout.", true, "index.html", "Go to Home");
  }

  const car = await fetchData(`http://localhost:3000/cars/${checkoutItem.carId}`);
  const bookings = await fetchData(`http://localhost:3000/bookings`);


  const alreadyBooked = bookings.find((b) => b.carId == checkoutItem.carId || !car.availability);
  if (alreadyBooked) return showSwal("warning", "Oops!", "Car is not Available Right Now!", true, "index.html", "Go to Home");

  toggleCheckoutVisibility(true);
  checkoutItem.userId = user.id;
  sessionStorage.setItem("cart", JSON.stringify(checkoutItem));

  // User Info
  document.getElementById("checkoutUserImage").src = user.image;
  document.getElementById("checkoutUserImage").alt = user.name;
  document.getElementById("checkoutUserName").textContent = user.name;
  document.getElementById("checkoutUserEmail").textContent = `(${user.email})`;

  // Car Info
  document.querySelector(".checkout-car-img").src = car.image;
  document.querySelector(".checkout-plan-model").textContent = `${car.brand} ${car.model}`;
  document.querySelector(".checkout-plan-desc").textContent = car.description;

  // Inputs
  const pickupDateInput = document.getElementById("pickupDate");
  const returnDateInput = document.getElementById("returnDate");
  const pickupDateDisplay = document.querySelector("#pick-date");
  const returnDateDisplay = document.querySelector("#end-date");
  const durationDisplay = document.getElementById("checkoutDuration");

  const formInputs = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    zipCode: document.getElementById("zipCode"),
    address: document.getElementById("address"),
    city: document.getElementById("city"),
    country: document.getElementById("country")
  };

  // Prefill data
  Object.entries(formInputs).forEach(([key, input]) => {
    if (checkoutItem[key]) input.value = checkoutItem[key];
  });

  updateLocationDisplay();

  // Input Listeners
  Object.entries(formInputs).forEach(([key, input]) => {
    const type = key === "country" ? "change" : "keyup";
    input.addEventListener(type, (e) => {
      checkoutItem[key] = key === "zipCode" ? parseInt(e.target.value) : e.target.value;
      sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
      updateLocationDisplay();
    });
  });

  const updateDateRange = () => {
    const days = calculateDays(pickupDateInput.value, returnDateInput.value);
    const validDates = pickupDateInput.value && returnDateInput.value;

    if (validDates && days) {
      updatePriceDisplay(car.pricePerDay, days);
      durationDisplay.classList.remove("d-none");
    } else {
      updatePriceDisplay(car.pricePerDay);
      durationDisplay.classList.add("d-none");
    }

    pickupDateDisplay.textContent = pickupDateInput.value || "";
    returnDateDisplay.textContent = returnDateInput.value || "";
  };

  const setDateLimits = () => {
    const today = new Date();
    const minPickup = today.toISOString().split("T")[0];
    pickupDateInput.min = minPickup;

    if (pickupDateInput.value) {
      const minReturn = new Date(pickupDateInput.value);
      minReturn.setDate(minReturn.getDate() + 1);
      returnDateInput.min = minReturn.toISOString().split("T")[0];
    }

    if (returnDateInput.value) {
      const maxPickup = new Date(returnDateInput.value);
      maxPickup.setDate(maxPickup.getDate() - 1);
      pickupDateInput.max = maxPickup.toISOString().split("T")[0];
    }
  };

  pickupDateInput.addEventListener("change", () => {
    checkoutItem.pickupDate = pickupDateInput.value;
    sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
    setDateLimits();
    updateDateRange();
  });

  returnDateInput.addEventListener("change", () => {
    checkoutItem.returnDate = returnDateInput.value;
    sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
    setDateLimits();
    updateDateRange();
  });

  if (checkoutItem.pickupDate) pickupDateInput.value = checkoutItem.pickupDate;
  if (checkoutItem.returnDate) returnDateInput.value = checkoutItem.returnDate;

  setDateLimits();
  updateDateRange();

  // Form validation
  const form = document.getElementById("checkoutForm");
  const inputs = form.querySelectorAll("input, select");

  const showError = (input, msg) => {
    input.classList.add("is-invalid");
    let error = input.parentElement.querySelector(".text-danger");
    if (!error) {
      error = document.createElement("div");
      error.className = "text-danger mt-1 small";
      input.parentElement.appendChild(error);
    }
    error.textContent = msg;
  };

  const clearError = (input) => {
    input.classList.remove("is-invalid");
    const error = input.parentElement.querySelector(".text-danger");
    if (error) error.remove();
  };

  inputs.forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;

    inputs.forEach((input) => {
      const value = input.value.trim();
      if (!value) {
        showError(input, "This field is required.");
        isValid = false;
      } else if (input.id === "zipCode" && !/^\d+$/.test(value)) {
        showError(input, "Postal Code must contain only numbers.");
        isValid = false;
      } else {
        clearError(input);
      }
    });

    if (!isValid) return;

    const existingBooking = bookings.find((b) => b.carId == checkoutItem.carId || !car.availability);
    if (existingBooking) return;

    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...checkoutItem, status: "pending", paymentMethod: "cash" })
    });

    const res2 = await fetch(`http://localhost:3000/cars/${checkoutItem.carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability: Boolean(false) })
    });

    if (res.ok && res2.ok) {
      sessionStorage.removeItem("cart");
      showSwal("success", "Success!", "Your booking has been successfully created.", true, "booking-history.html", "Go to Bookings");
    } else {
      showSwal("error", "Error!", "There was an error creating your booking. Please try again.");
    }
  });
};

handleCheckout();
