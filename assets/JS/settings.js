const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const passField = document.getElementById("password");
const imageField = document.getElementById("image");
const saveButton = document.getElementById("form-button");
const inputs = [nameField, phoneField, passField, imageField];
const loader = document.getElementById("loader")
// errors
const nameError = document.getElementById("name-error");
const phoneError = document.getElementById("phone-error");
const passwordError = document.getElementById("password-error");

const currentUserEmail = JSON.parse(localStorage.getItem("currentUser"));

fetchAndHandleUser();

async function fetchAndHandleUser() {
  const response = await getUsers();
  loader.style.display = "none";
  if (response.success) {
    const users = response.data;
    const currentUser = users.find((user) => user.email === currentUserEmail);
    if (currentUser) {
      nameField.value = currentUser.name;
      emailField.value = currentUser.email;
      phoneField.value = currentUser.phone;
      passField.value = currentUser.password;
      imageField.value = currentUser.image;
      saveButton.addEventListener("click", async (e) => {
        if (e.target.textContent == "Edit") {
          e.target.textContent = "Save";
          inputs.forEach((input) => {
            input.disabled = false;
          });
        } else {
          e.target.textContent = "Edit";
          inputs.forEach((input) => {
            input.disabled = true;
          });
          await confirmSignup(currentUser.id);
        }
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You Must login",
        icon: "error",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../login.html";
        }
      });
    }
  } else {
    Swal.fire({
      title: "Error!",
      text: "Can't load Data",
      icon: "error",
      confirmButtonText: "Try again",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
}

async function confirmSignup(id) {
  let isValid = true;
  const userData = {
    name: nameField.value,
    phone: phoneField.value,
    password: passField.value,
  };

  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    nameError.textContent = nameValidation.error;
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  const phoneValidation = validatePhone(userData.phone);
  if (!phoneValidation.isValid) {
    phoneError.textContent = phoneValidation.error;
    isValid = false;
  } else {
    phoneError.textContent = "";
  }

  if (!validatePassword(userData.password)) {
    passwordError.textContent = "*Password must be at least 8 characters*";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  if (isValid) {
    saveButton.textContent = "Updating...";
    saveButton.disabled = true;
    const res = await updateInfo(id, userData);
    saveButton.textContent = "Edit";
    saveButton.disabled = false;
    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully.",
        icon: "success",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: res.error || "Can't Update.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  }
}

// get data
async function getUsers() {
  try {
    const response = await fetch(`http://localhost:3000/users`);
    if (!response.ok) throw new Error("Failed to get Data");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to get Data" };
  }
}

// update data
async function updateInfo(userId, updatedData) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update Info");

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update Info" };
  }
}

// Field Validation Functions
const validateName = (name) => {
  const regex = /^[a-zA-Z0-9_\s]{5,30}$/;
  if (name.trim() === "") {
    return { isValid: false, error: "*user Name is required*" };
  } else if (!regex.test(name.trim())) {
    console.log(name.trim());
    return {
      isValid: false,
      error: "*Must be 5-30 characters (numbers, letters, _ )*",
    };
  } else {
    return { isValid: true, error: "" };
  }
};

const validatePhone = (phone) => {
  const regex = /^01[0-2,5]\d{8}$/;
  if (phone.trim() === "") {
    return { isValid: false, error: "*Phone is required*" };
  } else if (!regex.test(phone.trim())) {
    return { isValid: false, error: "*Invalid phone number*" };
  } else {
    return { isValid: true, error: "" };
  }
};

const validatePassword = (password) => {
  return password.length >= 8;
};
