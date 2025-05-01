
let pp = document.querySelector(".profile-image");
pp.src = "./assets/images/others/37fe057358bd77b11943809cb58b9af1.jpg";
let nameField = document.querySelector("#name");
let emailField = document.querySelector("#email");
let phoneField = document.querySelector("#phone");
let passField = document.querySelector("#password");
let imageField = document.querySelector("#image");
let saveButton = document.querySelector(".save-button");

const currentUserEmail = JSON.parse(localStorage.getItem("currentUser"));

async function fetchAndHandleUser() {
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    const currentUser = users.find((user) => user.email === currentUserEmail);
    if (currentUser) {
      const username = document.querySelector("#ph-profilename");
      username.textContent = currentUser.name;
      nameField.value = currentUser.name;
      emailField.value = currentUser.email;
      phoneField.value = currentUser.phone;
      passField.value = currentUser.password;
      imageField.value = currentUser.image;
      saveButton.addEventListener("click", (e) =>{
        e.preventDefault();
        updatingContact(currentUser.id)
      })
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
fetchAndHandleUser();

async function updatingContact(id) {
  const updatedUser = {
    name: nameField.value,
    email: emailField.value,
    phone: phoneField.value,
    password: passField.value,
    image: imageField.value,
  };
  const updateResult = await updateContact(id, updatedUser);
  if (updateResult.success) {
    console.log("Success!", "user updated.", "success");
  } else {
    console.log("Error!", updateResult.error, "error");
  }
}


// update data
async function updateContact(userId, updatedData) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update contact");

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update contact" };
  }
}