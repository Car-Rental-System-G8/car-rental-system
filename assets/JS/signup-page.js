// ipnuts and form
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupForm = document.getElementById("signup-form");

// errors
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const termsError = document.getElementById("terms-error");

// form submissison
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  const userData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
  };

  if (!validateName(userData.name)) {
    nameError.textContent = "*Invalid  - Must be at least 5 characters*";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  if (!validateEmail(userData.email)) {
    emailError.textContent = "*Invalid email*";
    isValid = false;
  } else {
    emailError.textContent = "";
  }

  if (!validatePhone(userData.phone)) {
    phoneError.textContent = "*Invalid phone number*";
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

  if (!validateConfirmPassword(userData.password, confirmPassword.value)) {
    confirmPasswordError.textContent = "*Passwords do not match*";
    isValid = false;
  } else {
    confirmPasswordError.textContent = "";
  }

  if (!document.getElementById("termsCheck").checked) {
    termsError.textContent = "*You must agree to the terms*";
    isValid = false;
  } else {
    termsError.textContent = "";
  }

  if (isValid) {
    const res = signUp(userData);
    if (res) {
      window.location.href = "/login-page.html";
    } else {
      console.log("Can't be Added");
    }
  }
});

async function signUp(userData) {
  try {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    const exists = users.some(
      (user) => user.email === userData.email || user.phone === userData.phone
    );

    if (exists) {
      alert("User already exists!");
      return false;
    }

    const newUser = {
      ...userData,
      id: users.length + 1,
      role: "user",
      bookings: [],
    };

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Signup failed:", error);
    return false;
  }
}

// Field Validation Functions
const validateName = (name) => {
  const regex = /^[a-zA-Z\s]{3,30}$/;
  return regex.test(name.trim());
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validatePhone = (phone) => {
  const regex = /^01[0-2,5]\d{8}$/;
  return regex.test(phone.trim());
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};
