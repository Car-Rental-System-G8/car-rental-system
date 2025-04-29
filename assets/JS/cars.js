import { addCarForm, displayCars, getCars, filterCars } from "./modules/carManager.js";

window.addEventListener("load", async () => {
  addCarForm();
  const carsData = await getCars();
  displayCars(carsData);

  const handleFilters = async () => {
    const brandInput = document.getElementById("brandFilter");
    const modelInput = document.getElementById("modelFilter");
    const typeInput = document.getElementById("typeFilter");
    const yearInput = document.getElementById("yearsFilter");
    const priceMinInput = document.getElementById("minPrice");
    const priceMaxInput = document.getElementById("maxPrice");

    let filteredCars = [];
    
    const brands = [], types = [], years = [], models = [];
    carsData.forEach(car => {
      if (!brands.some(el => el.toLowerCase() === car.brand.toLowerCase())) {
        brands.push(car.brand);
      }
      if (!models.some(el => el.toLowerCase() === car.model.toLowerCase())) {
        models.push(car.model);
      }
      if (!types.some(el => el.toLowerCase() === car.type.toLowerCase())) {
        types.push(car.type);
      }
      if (!years.some(el => el == car.year)) {
        years.push(car.year);
        years.sort();
      }
    });

    brands.forEach(brand => {
      brandInput.innerHTML += `<option value="${brand}">${brand}</option>`;
    });

    models.forEach(model => {
      modelInput.innerHTML += `<option value="${model}">${model}</option>`; 
    });

    types.forEach(type => {
      typeInput.innerHTML += `<option value="${type}">${type}</option>`;
    });

    years.forEach(year => {
      yearInput.innerHTML += `<option value="${year}">${year}</option>`;
    });

    document.getElementById("applyFilterBtn").addEventListener("click", async () => {
      const statusInput = document.querySelector("[name='statusFilter']:checked");
      const ratingInput = document.querySelector("[name='rating']:checked");
      
      const filterObj = {};

      if (statusInput.value != "") {
        filterObj.availability = statusInput.value === "true";
      }

      if (brandInput.value != "") {
        filterObj.brand = brandInput.value;
      }

      if (modelInput.value != "") {
        filterObj.model = modelInput.value;
      }

      if (typeInput.value != "") {
        filterObj.type = typeInput.value;
      }

      if (yearInput.value != "") {
        filterObj.year = yearInput.value;
      }

      if (priceMinInput.value != "" && priceMaxInput.value != "") {
        filterObj.pricePerDay = [priceMinInput.value, priceMaxInput.value];
      }

      if (priceMinInput.value == "" && priceMaxInput.value != "") {
        filterObj.pricePerDay = [0, priceMaxInput.value];
      }

      if (priceMinInput.value != "" && priceMaxInput.value == "") {
        filterObj.pricePerDay = [priceMinInput.value, Number.MAX_SAFE_INTEGER];
      }

      if (ratingInput.value != "") {
        filterObj.rating = ratingInput.value;
      }

      filteredCars = await filterCars(filterObj);
      displayCars(filteredCars);
    });

    const searchInput = document.getElementById("searchInput");
    
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();

      if (filteredCars.length === 0) {
        filteredCars = carsData;
      }
  
      const searched = filteredCars.filter(car =>
        car.name?.toLowerCase().includes(keyword) ||
        car.model?.toLowerCase().includes(keyword) ||
        car.type?.toLowerCase().includes(keyword) ||
        car.brand?.toLowerCase().includes(keyword)
      );

      displayCars(searched);
    });
  };

  handleFilters();
});