import { fetchData } from "./fetchData.js";

// carManager.js
let currentCarsPage = 1;

// ========= Car Operations =========
export const getCars = (_id = "") => fetchData(`http://localhost:3000/cars/${_id}`);

export const addCar = (newCarData) =>
  fetchData('http://localhost:3000/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCarData)
  });

export const updateCar = (_id, updatedData) =>
  fetchData(`http://localhost:3000/cars/${_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });

export const deleteCar = async (_id) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      const res = await fetch(`http://localhost:3000/cars/${_id}`, { method: 'DELETE' });
      const success = res.ok;

      Swal.fire(
        success ? 'Deleted!' : 'Failed!',
        success ? 'Your car has been deleted.' : 'There was an error while deleting the car.',
        success ? 'success' : 'error'
      );

      if (success) {
        const carsData = await getCars();
        displayCars(carsData, { inDashboard: true });
      }
    } else {
      Swal.fire('Cancelled', 'Your car is safe :)', 'info');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error!', 'There was an error while deleting the car.', 'error');
  }
};

// ========= DOM Rendering =========
export const displayCars = async (_cars, options = {}) => {
  const { 
    currentPage = 1, 
    carsLimit = 5, 
    carsOrder = "oldest",
    isPagination = true,
    inDashboard } = options;

  const container = inDashboard
    ? document.querySelector("#carsTableContainer")
    : document.querySelector("#carsContainer");

  if (!container) return;

  container.classList.add("fade-out");

  setTimeout(() => {
    container.innerHTML = "";

    let carsToDisplay = _cars;

    if (carsOrder === "newest") {
      carsToDisplay = _cars.slice().reverse().slice(0, carsLimit || _cars.length);
    } else if (carsOrder === "oldest") {
      carsToDisplay = _cars.slice(0, carsLimit || _cars.length);
    }
    
    if (isPagination && carsLimit > 0 && carsLimit < _cars.length) {
      const startIndex = (currentPage - 1) * carsLimit;
      const endIndex = startIndex + carsLimit ;
      carsToDisplay = _cars.slice(startIndex, endIndex);
      createPaginationControls(_cars.length, carsLimit , currentPage, inDashboard);
    }

    if (carsToDisplay.length === 0) {
      if (inDashboard) {
        const noDataMessage = document.createElement("tr");
        noDataMessage.innerHTML = `
          <td colspan="9" class="text-center text-muted">No cars to display!</td>
        `;
        container.appendChild(noDataMessage);
      } else {
        // No cars to display Code Here
      }
    } else {
      carsToDisplay.forEach((car) => {
        const { id, image, brand, model, type, year, pricePerDay, availability, rating } = car;

        if (inDashboard) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${id}</td>
            <td><img class="table-img" src="${image}" /></td>
            <td>${brand}</td>
            <td>${model}</td>
            <td>${type}</td>
            <td>${year}</td>
            <td>${pricePerDay}</td>
            <td>
              <div class="badge ${String(availability) === "true" ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-medium px-3 py-2">
                ${String(availability) === "true" ? 'Available' : 'Not Available'}
              </div>
            </td>
            <td class="text-start"><div class="dashboard-rating"><i class="fa fa-star"></i> ${rating}</div></td>
            <td>
              <div class="row row-cols-auto justify-content-end flex-nowrap g-2">
                <div class="col">
                  <button class="btn btn--primary edit-car-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#carEditModal">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </div>
                <div class="col">
                  <button class="btn btn-danger delete-car-btn" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </td>
          `;
          container.appendChild(tr);
        } else {
          // عرض الكروت لو مش داشبورد
        }
      });
    }

    if (inDashboard) setupCarEventListeners();

    container.classList.remove("fade-out");
    container.classList.add("fade-in");

    setTimeout(() => {
      container.classList.remove("fade-in");
    }, 500);
  }, 400);
};

const createPaginationControls = (totalCars, carsLimit , currentPage, inDashboard) => {
  const paginationContainer = document.getElementById("paginationControls");
  
  if (!paginationContainer) return;
  
  paginationContainer.classList.add("d-flex");
  paginationContainer.innerHTML = "";

  totalCars ? paginationContainer.classList.remove("d-none") : paginationContainer.classList.add("d-none");
  const totalPages = Math.ceil(totalCars / carsLimit);

  // Helper function to create pagination buttons
  const createPageButton = (text, page, disabled = false, isActive = false) => {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm btn-outline--primary ${isActive ? 'active' : ''}`;
    btn.textContent = text;
    btn.disabled = disabled;
    if (isActive) {
      btn.style.pointerEvents = 'none'; // Disable click on active button
    }
    btn.addEventListener("click", async () => {
      currentCarsPage = page;
      const carsData = await getCars();
      displayCars(carsData, { currentPage: page, carsLimit, inDashboard });
    });
    return btn;
  };

  // Previous button
  paginationContainer.appendChild(createPageButton('« Previous', currentPage - 1, currentPage === 1));

  // Always show the first page
  paginationContainer.appendChild(createPageButton(1, 1, false, currentPage === 1));

  // Show ellipsis (...) if there are many pages before the current page
  if (currentPage - 1 > 2) {
    paginationContainer.appendChild(createPageButton('...', 0, true)); // Disable the "..." button
  }

  // Display only the previous, current, and next pages
  const startPage = Math.max(2, currentPage - 1); // The page before current
  const endPage = Math.min(totalPages - 1, currentPage + 1); // The page after current

  // Append the page buttons to the pagination container
  for (let i = startPage; i <= endPage; i++) {
    const btn = createPageButton(i, i, false, i === currentPage);
    paginationContainer.appendChild(btn);
  }

  // Show ellipsis (...) if there are many pages after the current page
  if (currentPage + 1 < totalPages - 1) {
    paginationContainer.appendChild(createPageButton('...', 0, true)); // Disable the "..." button
  }

  // Always show the last page
  if (totalPages > 1) {
    paginationContainer.appendChild(createPageButton(totalPages, totalPages, false, currentPage === totalPages));
  }

  // Next button
  paginationContainer.appendChild(createPageButton('Next »', currentPage + 1, currentPage === totalPages));
};

// ========= Event Listeners =========
const setupCarEventListeners = () => {
  document.querySelectorAll(".edit-car-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => updateForm(e.currentTarget.dataset.id));
  });

  document.querySelectorAll(".delete-car-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteCar(e.currentTarget.dataset.id));
  });
};

export const updateForm = async (_id) => {
  const carEditForm = document.getElementById("carEditForm");
  const car = await getCars(_id);

  if (!car) return;

  fillForm(carEditForm, car);

  const updateCarBtn = document.getElementById("updateCarBtn");
  updateCarBtn.replaceWith(updateCarBtn.cloneNode(true));

  document.getElementById("updateCarBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const updatedData = getFormData(carEditForm);
    if (!validateCarData(updatedData)) return;

    const res = await updateCar(_id, updatedData);
    if (res) {
      bootstrap.Modal.getInstance(document.getElementById("carEditModal")).hide();
      toastr.success("Car updated successfully!");
      const carsData = await getCars();
      displayCars(carsData, { currentPage: currentCarsPage, inDashboard: true });
    } else {
      toastr.error("Something went wrong, please try again.");
    }
  });
};

export const addCarForm = async () => {
  const carAddForm = document.getElementById("carAddForm");
  const addCarButton = document.getElementById("addCarBtn");
  
  if (!addCarButton) return;

  addCarButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const newCarData = getFormData(carAddForm);
    if (!validateCarData(newCarData)) return;

    const res = await addCar(newCarData);
    if (res) {
      carAddForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("carAddModal")).hide();
      toastr.success("Car added successfully!");
      const carsData = await getCars();
      displayCars(carsData, { inDashboard: true });
    } else {
      toastr.error("Something went wrong, please try again.");
    }
  });
};

// ========= Get Cars Details =========
export const getCarsLength = async () =>  { 
  const cars = await getCars();
  return await cars.length;
};
export const getAvaliableCarsLength = async () =>  { 
  const cars = await getCars();
  const avaliable =  cars.filter((car) => String(car.availability) === "true");
  return await avaliable.length;
};

// ========= Helpers =========
const fillForm = (form, car) => {
  form.querySelector("[name=brand]").value = car.brand;
  form.querySelector("[name=model]").value = car.model;
  form.querySelector("[name=type]").value = car.type;
  form.querySelector("[name=year]").value = car.year;
  form.querySelector("[name=price]").value = car.pricePerDay;
  form.querySelector("[name=status]").value = car.availability;
  form.querySelector("[name=rating]").value = car.rating;
  form.querySelector("[name=image]").value = car.image;
};

const getFormData = (form) => ({
  brand: form.querySelector("[name=brand]").value.trim(),
  model: form.querySelector("[name=model]").value.trim(),
  type: form.querySelector("[name=type]").value.trim(),
  year: parseInt(form.querySelector("[name=year]").value),
  pricePerDay: parseFloat(form.querySelector("[name=price]").value),
  availability: form.querySelector("[name=status]").value,
  rating: parseFloat(form.querySelector("[name=rating]").value),
  image: form.querySelector("[name=image]").value.trim()
});

const validateCarData = ({ brand, model, type, image, year, pricePerDay, rating }) => {
  if (!brand || !model || !type || !image) {
    toastr.error("Please fill in all required fields!");
    return false;
  }

  if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    toastr.error("Please enter a valid year!");
    return false;
  }

  if (isNaN(pricePerDay) || pricePerDay <= 0) {
    toastr.error("Please enter a valid price!");
    return false;
  }

  if (isNaN(rating) || rating < 0 || rating > 5) {
    toastr.error("Please enter a rating between 0 and 5!");
    return false;
  }

  return true;
};
