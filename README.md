
# Car Management System

This project provides a car management system that allows adding, updating, deleting, and displaying cars. The system supports pagination and allows you to display the most recent cars or the first cars based on the user's choice. It also includes a dashboard for easy car management.

## Install json-server
```
npm i
```

## Start json-server
```
npx json-server api/db.json
```

## Features

- **CRUD Operations**: Create, Read, Update, and Delete cars.
- **Pagination**: Support for displaying cars in pages.
- **Dynamic Display**: Option to show the latest or the first cars without pagination.
- **Dashboard Integration**: Display cars in a structured table format in the dashboard.

## File Structure

- **carManager.js**: Contains logic for fetching, displaying, and interacting with car data.
- **index.html**: Main HTML file with the layout to display cars and car management functionalities.

---

## Functions Overview

### 1. **`fetchData(url, options = {})`**
Fetches data from a given URL and returns the response in JSON format. Handles errors by logging them to the console.

#### Example:
```javascript
const data = await fetchData('http://localhost:3000/cars');
```

### 2. **Car Operations**

#### `getCars(_id = "")`
Fetches all cars or a single car based on the provided `_id`.

```javascript
const cars = await getCars();  // Get all cars
const car = await getCars(1);  // Get car with id = 1
```

#### `addCar(newCarData)`
Adds a new car to the database.

```javascript
await addCar({ brand: 'Toyota', model: 'Corolla', year: 2020, pricePerDay: 100, availability: true, rating: 4.5 });
```

#### `updateCar(_id, updatedData)`
Updates an existing car's data.

```javascript
await updateCar(1, { pricePerDay: 120, availability: false });
```

#### `deleteCar(_id)`
Deletes a car based on its ID after a confirmation prompt.

```javascript
await deleteCar(1);  // Delete car with id = 1
```

### 3. **`displayCars(_cars, options = {})`**
Displays cars with pagination or without pagination based on the options.

**Options:**
- `currentPage`: The current page for pagination.
- `carsLimit`: The number of cars to display per page.
- `displayNewestCars`: If true, display the last `carsLimit` cars. If false, display the first `carsLimit` cars.
- `inDashboard`: If true, display cars in a table format suitable for a dashboard view.

#### Example:
```javascript
displayCars(carsData, { currentPage: 1, carsLimit: 9, carsOrder: "newest", isPagination: true, inDashboard: true });
```

### 4. **`createPaginationControls(totalCars, carsLimit, currentPage, inDashboard)`**
Creates pagination controls to navigate between pages of cars.

#### Example:
```javascript
createPaginationControls(100, 9, 1, true);  // Create pagination for 100 cars with 9 per page, starting on page 1
```

### 5. **Event Listeners**

- **`setupCarEventListeners`**: Adds event listeners to buttons like edit and delete in the dashboard.
- **`updateForm(_id)`**: Loads the data of a car into a form for editing.
- **`addCarForm()`**: Handles the addition of a new car via a form.

### 6. **Helper Functions**
- **`fillForm(form, car)`**: Fills the update form with car data.
- **`getFormData(form)`**: Extracts data from the form and returns it as an object.
- **`validateCarData(data)`**: Validates car data (checks required fields, valid year, price, rating).

---

## Usage

### Displaying Cars with Pagination

```javascript
displayCars(carsData, { currentPage: 1, carsLimit: 9, carsOrder: "newest", isPagination: true, inDashboard: true });
```

- **`currentPage`**: The page number to display.
- **`carsLimit`**: Number of cars to show per page.
- **`carsOrder`**: If "newest", shows the last `carsLimit` cars. If "oldest", shows the first `carsLimit` cars.
- **`isPagination`**: if true, show cars pagination.
- **`inDashboard`**: If true, displays the cars in a table format.

### Add a Car

To add a new car, use the `addCar` function. Example:

```javascript
document.getElementById("addCarBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const newCarData = getFormData(carAddForm);
  if (!validateCarData(newCarData)) return;

  const res = await addCar(newCarData);
  if (res) {
    toastr.success("Car added successfully!");
    const carsData = await getCars();
    displayCars(carsData, true);
  } else {
    toastr.error("Something went wrong, please try again.");
  }
});
```

### Edit a Car

To update a car's details, the form is populated with the existing data and saved using the `updateCar` function:

```javascript
updateForm(1);  // Updates the car with ID = 1
```

### Deleting a Car

A confirmation prompt is shown before deleting a car:

```javascript
deleteCar(1);  // Deletes the car with ID = 1
```

---

## Dependencies

- **Toastr**: For showing success and error notifications.
- **SweetAlert2**: For confirmation prompts when deleting cars.
- **Bootstrap**: For modal and button styling.

---

## Contributing

Feel free to fork the repository, submit issues, and make pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License.
