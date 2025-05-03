import { fetchData } from "./modules/fetchData.js";
import { getCurrentUser } from "./modules/userManager.js";

// sessionStorage.setItem("cart", JSON.stringify({"carId": "1"}))
const checkoutItem = JSON.parse(sessionStorage.getItem("cart"));
const taxRate = 0.10;
let hasConflict = false;

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

  if (!car.availability) return showSwal("warning", "Oops!", "Car is not Available Right Now!", true, "index.html", "Go to Home");

  toggleCheckoutVisibility(true);
  checkoutItem.userId = user.id;
  sessionStorage.setItem("cart", JSON.stringify(checkoutItem));

  document.getElementById("checkoutUserImage").src = user.image;
  document.getElementById("checkoutUserImage").alt = user.name;
  document.getElementById("checkoutUserName").textContent = user.name;
  document.getElementById("checkoutUserEmail").textContent = `(${user.email})`;

  document.querySelector(".checkout-car-img").src = car.images[0];
  document.querySelector(".checkout-plan-model").textContent = `${car.brand} ${car.model}`;
  document.querySelector(".checkout-plan-desc").textContent = car.description;

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

  Object.entries(formInputs).forEach(([key, input]) => {
    if (checkoutItem[key]) input.value = checkoutItem[key];
  });

  updateLocationDisplay();

  Object.entries(formInputs).forEach(([key, input]) => {
    const type = key === "country" ? "change" : "keyup";
    input.addEventListener(type, (e) => {
      checkoutItem[key] = key === "zipCode" ? parseInt(e.target.value) : e.target.value;
      sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
      updateLocationDisplay();
    });
  });

  const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const updateDateRange = () => {
    const pickup = new Date(pickupDateInput.value);
    const dropoff = new Date(returnDateInput.value);
  
    hasConflict = bookings.some((b) => {
      const bookedStart = new Date(b.pickupDate);
      const bookedEnd = new Date(b.returnDate);
      return (
        b.carId == checkoutItem.carId &&
        isOverlapping(pickup, dropoff, bookedStart, bookedEnd)
      );
    });
  
    if (hasConflict) {
      pickupDateInput.setCustomValidity("This car is already booked in this period.");
      returnDateInput.setCustomValidity("This car is already booked in this period.");
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'This car is already booked during the selected period. Please choose different dates.',
      });
    } else {
      pickupDateInput.setCustomValidity("");
      returnDateInput.setCustomValidity("");
    }
  
    const days = calculateDays(pickup, dropoff);
    const validDates = pickup && dropoff && days;
  
    if (validDates) {
      updatePriceDisplay(car.pricePerDay, days);
      durationDisplay.classList.remove("d-none");
    } else {
      updatePriceDisplay(car.pricePerDay);
      durationDisplay.classList.add("d-none");
    }
  
    pickupDateDisplay.textContent = pickup.toLocaleString() || "";
    returnDateDisplay.textContent = dropoff.toLocaleString() || "";
  
    const today = new Date().toISOString().slice(0, 16);
  
    if (pickupDateInput.value && pickupDateInput.value < today) {
      pickupDateInput.setCustomValidity("Pickup date cannot be in the past.");
    } else {
      pickupDateInput.setCustomValidity("");
    }
  
    if (pickupDateInput.value) {
      returnDateInput.min = pickup.toISOString().slice(0, 16);
    } else {
      returnDateInput.removeAttribute("min");
    }
  
    if (returnDateInput.value) {
      pickupDateInput.max = dropoff.toISOString().slice(0, 16);
    } else {
      pickupDateInput.removeAttribute("max");
    }
  
    pickupDateInput.min = today;
  
    if (returnDateInput.value) {
      returnDateInput.setCustomValidity("");
    }
  
    if (pickupDateInput.value && returnDateInput.value && new Date(pickupDateInput.value) >= new Date(returnDateInput.value)) {
      returnDateInput.setCustomValidity("Return date must be after Pickup date.");
    } else {
      if (pickupDateInput.value === returnDateInput.value) {
        returnDateInput.setCustomValidity("Return date must be later than Pickup date.");
      } else {
        returnDateInput.setCustomValidity("");
      }
    }
  };

  pickupDateInput.addEventListener("change", () => {
    checkoutItem.pickupDate = pickupDateInput.value;
    sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
    updateDateRange();
  });

  returnDateInput.addEventListener("change", () => {
    checkoutItem.returnDate = returnDateInput.value;
    sessionStorage.setItem("cart", JSON.stringify(checkoutItem));
    updateDateRange();
  });

  if (checkoutItem.pickupDate) pickupDateInput.value = checkoutItem.pickupDate;
  if (checkoutItem.returnDate) returnDateInput.value = checkoutItem.returnDate;

  updateDateRange();

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
      } else if (!input.checkValidity()) {
        showError(input, input.validationMessage);
        isValid = false;
      } else {
        clearError(input);
      }
    });

    if (hasConflict) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Conflict!',
        text: 'The selected dates conflict with an existing booking. Please choose different dates.',
      });
      return;
    }

    if (!isValid) return;

    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...checkoutItem, status: "pending", paymentMethod: "cash" })
    });

    if (res.ok) {
      sessionStorage.removeItem("cart");
      showSwal("success", "Success!", "Your booking has been successfully created.", true, "booking-history.html", "Go to Bookings");
    } else {
      showSwal("error", "Error!", "There was an error creating your booking. Please try again.");
    }
  });
};

handleCheckout();
