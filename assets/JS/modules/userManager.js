import { fetchData } from "./fetchData.js";

export const getCurrentUser = async () => {
  const users = await fetchData("http://localhost:3000/users");
  const storedEmail = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = users.find((user) => {
    return user.email === storedEmail;
  });
  return currentUser;
};

// Logout Functionality
export const logout = () => {
  document.querySelectorAll(".logout-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location = "/";
    });
  });
};