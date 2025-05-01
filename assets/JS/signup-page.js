// ipnuts and form
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupForm = document.getElementById("signup-form");
const signupBtn = document.getElementById("signup-btn");

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
  confirmSignup();
});

async function confirmSignup(){
  let isValid = true;
  const userData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
  };

  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    nameError.textContent = nameValidation.error;
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    emailError.textContent = emailValidation.error;
    isValid = false;
  } else {
    emailError.textContent = "";
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
    signupBtn.textContent = "Loading...";
    signupBtn.disabled = true;
    const res = await signUp(userData);
    signupBtn.textContent = "Sign up";
    signupBtn.disabled = false;
    if (res.success) {
      window.location.href = "./login.html";
    } else if (res.error === "User already exist.") {
      Swal.fire({
        title: "Notice!",
        text: "User already exist.",
        icon: "warning",
        confirmButtonText: "Try Again",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: res.error || "Can't Signup.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  }
}

async function signUp(userData) {
  const result = await getUsers();
  if (result.success) {
    const users = result.data;
    const exists = users.some(
      (user) => user.email === userData.email || user.phone === userData.phone
    );
    if (exists) {
      return { success: false, error: "User already exist." };
    } else {
      const newUser = {
        ...userData,
        role: "user",
      };
      const response = await addUser(newUser);
      return response;
    }
  } else {
    return result;
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

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === "") {
    return { isValid: false, error: "*E-mail is required*" };
  } else if (!regex.test(email.trim())) {
    return { isValid: false, error: "*Invalid email*" };
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

const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// API
async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error("Failed to Sign up.");

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
}

async function addUser(userData) {
  try {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.message || "API request failed",
      };
    }

    return { success: true, data: await res.json() };
  } catch (error) {
    return { success: false, error: "Network error. Please try again." };
  }
}
