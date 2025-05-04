
// inputs and form
const loginForm = document.getElementById("login-form");
const mail = document.getElementById("email");
const password = document.getElementById("password");

// errors
const mailError = document.getElementById("mail-error");
const passwordError = document.getElementById("password-error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  const userData = {
    email: mail.value,
    password: password.value,
  };

  if (!validateEmail(userData.email)) {
    mailError.textContent = "*Invalid email!*";
    isValid = false;
  } else {
    mailError.textContent = "";
  }

  if (!validatePassword(userData.password)) {
    passwordError.textContent = "*Password must be at least 8 characters*";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  if (isValid) {
    login(userData.email, userData.password);
  }
});

async function login(email, password) {
  const result = await getUsers();
  if (result.success) {
    const users = result.data;
    const user = users.find((u) => u.email === email);
    if (!user) {
      mailError.textContent = "*Invalid email*";
      return;
    } else if (user.password !== password) {
      passwordError.textContent = "*Wrong password! Try again*";
      return;
    }

    if (user.role === "admin") {
        window.location.href = "./admin/index.html";
    } else {

        window.location.href = "./index.html";
    }

    localStorage.setItem("currentUser", JSON.stringify(user.email));
    
  } else {
    Swal.fire({
      title: "Error!",
      text: result.error || "Can't Login.",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
}

// Field Validation Functions
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validatePassword = (password) => {
  return password.length >= 8;
};


// Api
async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error("Failed to Log in.");

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
}