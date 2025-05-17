// carManager.js
import { fetchData } from "./fetchData.js";

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
        displayCars(carsData);
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
export function displayStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fa fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fa fa-star-half-alt"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

export const displayCars = async (_cars, options = {}) => {
  const {
    currentPage = 1,
    carsLimit = 5, 
    isPagination = true } = options;

  const container = document.querySelector("#carsTableContainer");

  if (!container) return;

  container.classList.add("fade-out");

  setTimeout(() => {
    container.innerHTML = "";

    let carsToDisplay = _cars;
    
    if (isPagination && carsLimit > 0 && carsLimit < _cars.length) {
      const startIndex = (currentPage - 1) * carsLimit;
      const endIndex = startIndex + carsLimit ;
      carsToDisplay = _cars.slice(startIndex, endIndex);
    }
    createPaginationControls(_cars, _cars.length, carsLimit , currentPage);

    if (carsToDisplay.length === 0) {
      const noDataMessage = document.createElement("tr");
      noDataMessage.innerHTML = `
        <td colspan="10" class="text-center text-muted">No cars to display!</td>
      `;
      container.appendChild(noDataMessage);
    } else {
      carsToDisplay.forEach((car) => {
        const { id, images, brand, model, type, year, pricePerDay, availability, reviews } = car;
        const averageRating = reviews.reduce((acc, review) => acc + parseInt(review.rating), 0) / reviews.length;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${id}</td>
          <td><img class="table-img" src="${images ? images[0] : ""}" /></td>
          <td>${brand}</td>
          <td>${model}</td>
          <td>${type}</td>
          <td>${year}</td>
          <td>${pricePerDay} EGP</td>
          <td>
            <div class="badge ${availability === true ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-medium px-3 py-2">
              ${availability === true ? 'Available' : 'Not Available'}
            </div>
          </td>
          <td>
            <div class="dashboard-rating">
              ${displayStars(averageRating)}
            </div>
          </td>
          <td>
            <div class="row row-cols-auto justify-content-end flex-nowrap g-2">
              <div class="col">
                <button class="btn btn--primary btn-sm edit-car-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#carEditModal">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
              <div class="col">
                <button class="btn btn-danger btn-sm delete-car-btn" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </td>
        `;
        container.appendChild(tr);
      });
    }

    setupCarEventListeners();

    container.classList.remove("fade-out");
    container.classList.add("fade-in");

    setTimeout(() => {
      container.classList.remove("fade-in");
    }, 500);
  }, 400);
};

const createPaginationControls = (cars, totalCars, carsLimit , currentPage) => {
  const paginationContainer = document.getElementById("paginationControls");
  
  if (!paginationContainer) return;
  
  paginationContainer.classList.add("d-flex");
  paginationContainer.innerHTML = "";

  totalCars ? paginationContainer.classList.remove("d-none") : paginationContainer.classList.add("d-none");
  const totalPages = Math.ceil(totalCars / carsLimit);

  const createPageButton = (text, page, disabled = false, isActive = false) => {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm btn-outline--primary ${isActive ? 'active' : ''}`;
    btn.textContent = text;
    btn.disabled = disabled;
    if (isActive) {
      btn.style.pointerEvents = 'none';
    }
    btn.addEventListener("click", async () => {
      currentCarsPage = page;
      displayCars(cars, { currentPage: page, carsLimit });
    });
    return btn;
  };

  paginationContainer.appendChild(createPageButton('« Previous', currentPage - 1, currentPage === 1));

  paginationContainer.appendChild(createPageButton(1, 1, false, currentPage === 1));

  if (currentPage - 1 > 2) {
    paginationContainer.appendChild(createPageButton('...', 0, true));
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    const btn = createPageButton(i, i, false, i === currentPage);
    paginationContainer.appendChild(btn);
  }

  if (currentPage + 1 < totalPages - 1) {
    paginationContainer.appendChild(createPageButton('...', 0, true));
  }

  if (totalPages > 1) {
    paginationContainer.appendChild(createPageButton(totalPages, totalPages, false, currentPage === totalPages));
  }

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

  let imagePaths = [];
  carEditForm.querySelector("[name=image]").addEventListener('change', function(e) {
    const files = e.target.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        imagePaths.push(`/assets/images/cars/${file.webkitRelativePath}`);
      }
    }
  });

  document.getElementById("updateCarBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const updatedData = getFormData(carEditForm);
    if (!validateCarData(updatedData)) return;

    let res;
    imagePaths.length ?
      res = await updateCar(_id, { ...updatedData, images: imagePaths }) :
      res = await updateCar(_id, updatedData);

    if (res) {
      bootstrap.Modal.getInstance(document.getElementById("carEditModal")).hide();
      toastr.success("Car updated successfully!");
      const carsData = await getCars();
      displayCars(carsData, { currentPage: currentCarsPage });
    } else {
      toastr.error("Something went wrong, please try again.");
    }

  });
};

export const addCarForm = async () => {
  const carAddForm = document.getElementById("carAddForm");
  const addCarButton = document.getElementById("addCarBtn");
  
  if (!addCarButton) return;

  let imagePaths = [];
  carAddForm.querySelector("[name=image]").addEventListener('change', function(e) {
    const files = e.target.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        imagePaths.push(`/assets/images/cars/${file.webkitRelativePath}`);
      }
    }
  });

  addCarButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const newCarData = getFormData(carAddForm);
    if (!validateCarData(newCarData)) return;

    const res = await addCar({...newCarData, images: imagePaths});
    if (res) {
      carAddForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("carAddModal")).hide();
      toastr.success("Car added successfully!");
      const carsData = await getCars();
      displayCars(carsData);
    } else {
      toastr.error("Something went wrong, please try again.");
    }
    imagePaths = [];
  });
};

// ========= Get Cars Details =========
export const getCarsLength = async () =>  { 
  const cars = await getCars();
  return await cars.length;
};
export const getAvaliableCarsLength = async () =>  { 
  const cars = await getCars();
  const avaliable =  cars.filter((car) => car.availability === true);
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
  form.querySelector("[name=description]").value = car.description;
};

const getFormData = (form) => ({
  brand: form.querySelector("[name=brand]").value.trim(),
  model: form.querySelector("[name=model]").value.trim(),
  type: form.querySelector("[name=type]").value.trim(),
  year: parseInt(form.querySelector("[name=year]").value),
  pricePerDay: parseFloat(form.querySelector("[name=price]").value),
  availability: form.querySelector("[name=status]").value === "true",
  description: form.querySelector("[name=description]").value.trim()
});

const validateCarData = ({ brand, model, type, year, pricePerDay, rating, description }) => {
  if (!brand || !model || !type || !description) {
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

  return true;
};

export const filterCars = async (_filters = {}) => {
  const cars = await getCars();

  return cars.filter((car) => {
    return Object.entries(_filters).every(([key, value]) => {
      const rawValue = car[key];
      const carValue = !isNaN(parseFloat(rawValue)) ? parseFloat(rawValue) : rawValue;

      if (key === "rating" && !isNaN(parseFloat(value))) {
        const filterRating = parseFloat(value); // القيمة التي سيتم الفلترة بناءً عليها

        // حساب متوسط التقييم للسيارة من المراجعات
        const averageRating = car.reviews.reduce((sum, review) => sum + review.rating, 0) / car.reviews.length;

        // التصفية بناءً على التقييم
        return averageRating >= filterRating; // إذا كان متوسط التقييم أكبر من أو يساوي الفلتر
      }

      if (key === "year" && !isNaN(parseFloat(value))) {
        return carValue == parseFloat(value);
      }

      if (Array.isArray(value) && !isNaN(parseFloat(value[0])) && !isNaN(parseFloat(value[1]))) {
        const [min, max] = value;
        return carValue >= parseInt(min) && carValue <= parseInt(max);
      }

      if (typeof value === 'string' && typeof carValue === 'string') {
        return carValue.toLowerCase() === value.toLowerCase();
      }

      return carValue === value;
    });
  });
};


