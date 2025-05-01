# Car Manager Module

This module is responsible for managing car-related operations in a JavaScript-based car rental dashboard application. It provides functionalities to handle data retrieval, UI rendering, CRUD operations, filtering, pagination, and interaction with modals.

## 📁 File Overview

**File:** `carManager.js`  
**Dependencies:**  
- `fetchData.js` - A wrapper for fetch API
- SweetAlert2 - For confirmation and alerts
- Toastr - For toast notifications
- Bootstrap - For modal management

---

## ✅ Features

- Fetch all cars or a single car by ID
- Add a new car
- Update existing car data
- Delete a car with confirmation
- Display cars in a paginated table
- Attach edit and delete button listeners
- Populate modals with car data
- Client-side car filtering with multiple conditions
- Form data extraction and validation

---

## 🚀 How to Use

### Importing
```js
import * as CarManager from './carManager.js';
```

### Get Cars
```js
CarManager.getCars(); // fetch all cars
CarManager.getCars("123"); // fetch a single car by ID
```

### Add a New Car
```js
CarManager.addCar({ brand, model, type, year, pricePerDay, availability, rating, image });
```

### Update an Existing Car
```js
CarManager.updateCar(carId, updatedData);
```

### Delete a Car
```js
CarManager.deleteCar(carId); // Uses SweetAlert2 for confirmation
```

### Display Cars in the Table
```js
CarManager.displayCars(carArray, {
  currentPage: 1,
  carsLimit: 5,
  isPagination: true
});
```

### Attach Add Car Form Logic
```js
CarManager.addCarForm();
```

### Attach Update Car Form Logic
```js
CarManager.updateForm(carId);
```

### Get Car Count
```js
await CarManager.getCarsLength(); // total cars
await CarManager.getAvaliableCarsLength(); // only available cars
```

### Filter Cars
```js
CarManager.filterCars({ brand: "Toyota", year: 2022, rating: 4 });
```

---

## 🧠 Implementation Notes

- `displayCars()` includes dynamic pagination via `createPaginationControls()`
- Pagination buttons adapt to page context with "..." if necessary
- `fillForm()` pre-fills the modal forms using DOM selectors
- `validateCarData()` ensures valid inputs before add/update
- `filterCars()` supports string, numeric, and range-based filters

---

## 🔧 Required DOM Elements

Ensure the following elements exist in your HTML:

- `#carsTableContainer` – Table body container
- `#paginationControls` – For pagination buttons
- `#carAddForm`, `#carEditForm` – Modal forms
- `#addCarBtn`, `#updateCarBtn` – Buttons inside modals

---

## 📌 Example Workflow

```js
const allCars = await CarManager.getCars();
CarManager.displayCars(allCars, { currentPage: 1, carsLimit: 5 });
```

---

## 📎 Tip

This module expects a backend running at:
```
http://localhost:3000/cars
```

---

## 🧼 Clean Code Practices

- Separated concerns: UI, logic, data
- Asynchronous handling with `async/await`
- Graceful error handling with fallback alerts
- Modular structure, reusable helpers

---

## 🛡️ Validations

- Year should be between 1900 and current year
- Price should be a positive number
- Rating should be between 0 and 5
- All required fields must be filled

---

## 📞 Contact

For improvements or issues, please reach out to the development team.

---

Happy coding!