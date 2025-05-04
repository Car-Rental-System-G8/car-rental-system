//  ================ Get Cars ===========================

//   api 
const carsUrl = "http://localhost:3000/cars";
const bookingsUrl = "http://localhost:3000/bookings";
const usersUrl = "http://localhost:3000/users";


class APIHandler {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async fetchData() {
    try {
      const response = await fetch(this.endpoint);

      if (!response.ok) {
        throw new Error("Error, please reload the page.");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data;
      } else {
        console.warn(`No data found at ${this.endpoint}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching data from ${this.endpoint}:`, error);
      return [];
    }
  }

}


const carsAPI = new APIHandler("http://localhost:3000/cars");
const bookingsAPI = new APIHandler("http://localhost:3000/bookings");
const usersAPI = new APIHandler("http://localhost:3000/users");

// get Cars 
export async function initCars() {
  const cars = await carsAPI.fetchData();
  return cars;
}


// get bookings 
export async function initBookings() {
  const bookings = await bookingsAPI.fetchData();
  return bookings;
}


// get users 
export async function initUsers() {
  const users = await usersAPI.fetchData();
  return users;
}