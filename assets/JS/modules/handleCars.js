// carManager.js

// ========= Utility Fetch Function =========
const fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};

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
        displayCars(carsData, true);
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
export const displayCars = async (_cars, inDashboard) => {
  const container = inDashboard
    ? document.querySelector("#carsTableContainer")
    : document.querySelector("#carsContainer"); // هنا هتحتاج تحط container اللي هتعرض فيه cars بتاعتك

  if (!container) return;
  container.innerHTML = "";

  _cars.forEach((car) => {
    const { id, image, brand, model, type, year, pricePerDay, availability, rating } = car;

    if (inDashboard) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td><img src="${image}" /></td>
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
        <td>${rating}</td>
        <td>
          <div class="row row-cols-auto justify-content-end flex-nowrap g-2">
            <div class="col">
              <button class="btn btn-primary edit-car-btn" data-id="${id}" data-bs-toggle="modal" data-bs-target="#carEditModal">
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
      // هنا كود العرض بتاعك ممكن تشوف انا عاملها ازاي وتعمل زيها
    }
  });

  if (inDashboard) setupCarEventListeners();
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
      displayCars(carsData, true);
    } else {
      toastr.error("Something went wrong, please try again.");
    }
  });
};

export const addCarForm = () => {
  const carAddForm = document.getElementById("carAddForm");
  document.getElementById("addCarBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const newCarData = getFormData(carAddForm);
    if (!validateCarData(newCarData)) return;

    const res = await addCar(newCarData);
    if (res) {
      carAddForm.reset();
      bootstrap.Modal.getInstance(document.getElementById("carAddModal")).hide();
      toastr.success("Car added successfully!");
      const carsData = await getCars();
      displayCars(carsData, true);
    } else {
      toastr.error("Something went wrong, please try again.");
    }
  });
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
