export const getCars = async (_id) => {
  try {
    let res;
    if (_id) {
      res = await fetch(`http://localhost:3000/cars/${_id}`);
    } else {
      res = await fetch(`http://localhost:3000/cars`);
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cars:", error.message);
    return null;
  }
};

const addCar = async (newCarData) => {
  try {
    const res = await fetch('http://localhost:3000/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCarData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result;

  } catch (error) {
    console.error('Error adding car:', error.message);
    return null;
  }
};

export const updateCar = async (_id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:3000/cars/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result;

  } catch (error) {
    console.error("Error updating car:", error.message);
    return null;
  }
};

const deleteCar = async (_id) => {
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
      const res = await fetch(`http://localhost:3000/cars/${_id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        Swal.fire(
          'Deleted!',
          'Your car has been deleted.',
          'success'
        );
      } else {
        Swal.fire(
          'Failed!',
          'There was an error while deleting the car.',
          'error'
        );
      }

      displayCars();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your car is safe :)',
        'info'
      );
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire(
      'Error!',
      'There was an error while deleting the car.',
      'error'
    );
  }
};

const displayCars = async (_cars) => {
  const cars = await getCars();
  const carsTableBody = document.querySelector("#carsTable tbody");

  carsTableBody.innerText = "";
  cars.forEach((car) => {
    const trTemplate = `
      <td>${car.id}</td>
      <td>
        <img src="${car.image}" />
      </td>
      <td>
        ${car.brand}
      </td>
      <td>
        ${car.model}
      </td>
      <td>
        ${car.type}
      </td>
      <td>
        ${car.year}
      </td>
      <td>
        ${car.pricePerDay}
      </td>
      <td>
        ${ String(car.availability) === "true" ? 
          '<div class="badge bg-success-subtle text-success fw-medium px-3 py-2">Available</div>' : 
          '<div class="badge bg-danger-subtle text-danger fw-medium px-3 py-2">Not Available</div>' 
        }
      </td>
      <td>
        ${car.rating}</td>
      <td>
        <div class="row row-cols-auto justify-content-end flex-nowrap g-2">
          <div class="col">
            <button class="btn btn-primary edit-car-btn" data-bs-toggle="modal" data-bs-target="#carEditModal">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <div class="col">
            <button class="btn btn-danger delete-car-btn" data-car-delete="${car.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </td>
    `;
    const trEl = document.createElement("tr");
    trEl.innerHTML = trTemplate
    carsTableBody.appendChild(trEl);

    const editBtn = trEl.querySelector(".edit-car-btn");
    editBtn.addEventListener("click", () => updateForm(car.id));
  });

  const deleteButtons = document.querySelectorAll("[data-car-delete]");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-car-delete");
      deleteCar(id);
    });
  });
};

const updateForm = async (_id) => {
  const carEditForm = document.getElementById("carEditForm");
  const updateCarBtn = document.getElementById("updateCarBtn");

  let car = await getCars(_id);

  const brandInput = carEditForm.querySelector("[name=brand]");
  const modelInput = carEditForm.querySelector("[name=model]");
  const typeInput = carEditForm.querySelector("[name=type]");
  const yearInput = carEditForm.querySelector("[name=year]");
  const priceInput = carEditForm.querySelector("[name=price]");
  const statusInput = carEditForm.querySelector("[name=status]");
  const ratingInput = carEditForm.querySelector("[name=rating]");
  const imageInput = carEditForm.querySelector("[name=image]");

  brandInput.value = car.brand;
  modelInput.value = car.model;
  typeInput.value = car.type;
  yearInput.value = car.year;
  priceInput.value = car.pricePerDay;
  statusInput.value = car.availability;
  ratingInput.value = car.rating;
  imageInput.value = car.image;

  updateCarBtn.replaceWith(updateCarBtn.cloneNode(true));
  const newUpdateCarBtn = document.getElementById("updateCarBtn");

  newUpdateCarBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();
    const type = typeInput.value.trim();
    const image = imageInput.value.trim();
    const year = parseInt(yearInput.value);
    const price = parseFloat(priceInput.value);
    const rating = parseFloat(ratingInput.value);

    if (!brand || !model || !type || !image) {
      toastr.error("Please fill in brand, model, type and Image.!");
      return;
    }
  
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      toastr.error("Please enter a valid year!");
      return;
    }
  
    if (isNaN(price) || price <= 0) {
      toastr.error("Please enter a valid price!");
      return;
    }
  
    if (isNaN(rating) || rating < 0 || rating > 5) {
      toastr.error("Please enter a rating between 0 and 5!");
      return;
    }

    const updatedData = {
      brand: brandInput.value,
      model: modelInput.value,
      type: typeInput.value,
      year: yearInput.value,
      pricePerDay: priceInput.value,
      availability: statusInput.value,
      rating: ratingInput.value,
      image: imageInput.value,
    };
  
    const res = await updateCar(_id, updatedData);
  
    if (res) {
      const modalElement = document.getElementById("carEditModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      toastr.success("Car updated successfully!");
      displayCars();
    } else {
      alert("Something went wrong, please try again.");
    }
  });
};

const addCarForm = async () => {
  const carAddForm = document.getElementById("carAddForm");
  const addCarBtn = document.getElementById("addCarBtn");

  addCarBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const brandInput = carAddForm.querySelector("[name=brand]");
    const modelInput = carAddForm.querySelector("[name=model]");
    const typeInput = carAddForm.querySelector("[name=type]");
    const yearInput = carAddForm.querySelector("[name=year]");
    const priceInput = carAddForm.querySelector("[name=price]");
    const statusInput = carAddForm.querySelector("[name=status]");
    const ratingInput = carAddForm.querySelector("[name=rating]");
    const imageInput = carAddForm.querySelector("[name=image]");

    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();
    const type = typeInput.value.trim();
    const image = imageInput.value.trim();
    const year = parseInt(yearInput.value);
    const price = parseFloat(priceInput.value);
    const rating = parseFloat(ratingInput.value);

    if (!brand || !model || !type || !image) {
      toastr.error("Please fill in brand, model, type, and Image.");
      return;
    }

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      toastr.error("Please enter a valid year!");
      return;
    }

    if (isNaN(price) || price <= 0) {
      toastr.error("Please enter a valid price!");
      return;
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      toastr.error("Please enter a rating between 0 and 5!");
      return;
    }

    const newCarData = {
      brand,
      model,
      type,
      year,
      pricePerDay: price,
      availability: statusInput.value,
      rating,
      image
    };

    const res = await addCar(newCarData);

    if (res) {
      carAddForm.reset();
      const modalElement = document.getElementById("carAddModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      toastr.success("Car Added successfully!");
      displayCars(); 
    } else {
      toastr.error("Something went wrong, please try again.");
    }
  });
};

addCarForm();
displayCars();