//  ================ Get Cars ===========================

//   api 
const carsUrl = "http://localhost:3000/cars";


async function getCars() {
    try {
        const response = await fetch(carsUrl);
    
        if (!response.ok) {
          throw new Error(`Error Please Reload the page`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data;
        } else {
             console.log(" No cars data found");
        }
      } catch (error) {
        console.log(" Error fetching cars");
      }
}

// initiate Cars Function to get data from the API and render it
export async function initCars() {
  try {
    const data = await getCars();
    return data;
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    return [];
  }
}





