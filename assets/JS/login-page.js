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
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();

    const user = users.find((u) => u.email === email);

    if (!user) {
      mailError.textContent = "*Invalid email*";
      return;
    } else if (user.password !== password) {
      passwordError.textContent = "*Wrong password! Try again*";
      return;
    }

    if (user.role === "admin") {
      //   window.location.href = "/admin-dashboard.html";
      console.log("admin dashbord");
    } else {
      //   window.location.href = "/user-dashboard.html";
      console.log("USER dashbord");
    }

    localStorage.setItem("currentUser", JSON.stringify(user.email));
  } catch (error) {
    console.error("Login failed:", error);
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
