//  ================ Get Cars ===========================

//   api 
const carsUrl = "http://localhost:3000/cars";
const bookingsUrl = "http://localhost:3000/bookings";
const usersUrl = "http://localhost:3000/users";






// // initiate Cars Function to get data from the API and render it
// export async function initCars() {
//   try {
//     const data = await fetchData(carsUrl);
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch cars:', error);
//     return [];
//   }
// }


// // get bookings 
// export async function initBookings() {
//   try {
//     const data = await fetchData(bookingsUrl);
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch cars:', error);
//     return [];
//   }
// }


// // get bookings 
// export async function initUsers() {
//   try {
//     const data = await fetchData(usersUrl);
//     return data;
//   } catch (error) {
//     console.error('Failed to fetch cars:', error);
//     return [];
//   }
// }




// async function fetchData(api) {
//   try {
//     const response = await fetch(api);

//     if (!response.ok) {
//       throw new Error(`Error Please Reload the page`);
//     }
//     const data = await response.json();
//     if (Array.isArray(data) && data.length > 0) {
//         return data;
//     } else {
//          console.log(" No cars data found");
//     }
//   } catch (error) {
//     console.log(" Error fetching cars");
//   }
// }


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