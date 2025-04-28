

//  ================ Get Cars ===========================

//   api end Point
const carsUrl = "http://localhost:3000/cars";

 export async function getCars() {
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


