import { fetchData } from "./fetchData.js";

export const getCurrentUser = async () => {
  const users = await fetchData("http://localhost:3000/users");
  const storedEmail = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = users.find((user) => {
    return user.email === storedEmail;
  });
  return currentUser;
};