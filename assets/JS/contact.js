const contactForm = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const firstNameError = document.getElementById("first-name-error-message");
const lastNameError = document.getElementById("last-name-error-message");
const emailError = document.getElementById("email-error-message");
const phoneError = document.getElementById("phone-error-message");
const subjectError = document.getElementById("subject-error-message");
const messageError = document.getElementById("message-error-message");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  firstNameError.innerHTML = "";
  lastNameError.innerHTML = "";
  emailError.innerHTML = "";
  phoneError.innerHTML = "";
  subjectError.innerHTML = "";
  messageError.innerHTML = "";
  if (!firstName.value.trim()) {
    firstNameError.innerHTML = "*First Name is required.*";
  }
  if (!lastName.value.trim()) {
    lastNameError.innerHTML = "*Last Name is required.*";
  }
  if (!email.value.trim()) {
    emailError.innerHTML = "*Email is required.*";
  } else if (!validateEmail(email.value)) {
    emailError.innerHTML = "*Email format is invalid.*";
  }
  if (!phone.value.trim()) {
    phoneError.innerHTML = "*Phone is required.*";
  } else if (!validatePhone(phone.value)) {
    phoneError.innerHTML = "*Phone must be 11 digits.*";
  }
  if (!subject.value.trim() || subject.value.length < 5) {
    subjectError.innerHTML = "*Subject is required.*";
  }
  if (!message.value.trim() || message.value.length < 10) {
    messageError.innerHTML = "*Message is required.*";
  } else {
    // sweet alert
    //navigate to home
    alert("Form submitted successfully!");
  }
});

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validatePhone = (phone) => {
  const regex = /^01[0-2,5]\d{8}$/;
  return regex.test(phone.trim());
};
