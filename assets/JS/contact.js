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

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let isValid = true;
  const contactData = {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    subject: subject.value.trim(),
    message: message.value.trim(),
    date: new Date().toISOString().slice(0, 10),
    read: false,
    starred: false,
  };

  const userId = await getUserId();
  contactData.userId = userId;
  [
    firstNameError,
    lastNameError,
    emailError,
    phoneError,
    subjectError,
    messageError,
  ].forEach((el) => (el.innerHTML = ""));

  const MIN_SUBJECT = 5;
  const MIN_MESSAGE = 10;

  if (!contactData.firstName) {
    firstNameError.innerHTML = "*First Name is required.*";
    isValid = false;
  }
  if (!contactData.lastName) {
    lastNameError.innerHTML = "*Last Name is required.*";
    isValid = false;
  }
  if (!contactData.email) {
    emailError.innerHTML = "*Email is required.*";
    isValid = false;
  } else if (!validateEmail(contactData.email)) {
    emailError.innerHTML = "*Email format is invalid.*";
    isValid = false;
  }
  if (!contactData.phone) {
    phoneError.innerHTML = "*Phone is required.*";
    isValid = false;
  } else if (!validatePhone(contactData.phone)) {
    phoneError.innerHTML = "*Phone must be 11 digits.*";
    isValid = false;
  }
  if (!contactData.subject || contactData.subject.length < MIN_SUBJECT) {
    subjectError.innerHTML = `*Subject must be at least ${MIN_SUBJECT} characters.*`;
    isValid = false;
  }
  if (!contactData.message || contactData.message.length < MIN_MESSAGE) {
    messageError.innerHTML = `*Message must be at least ${MIN_MESSAGE} characters.*`;
    isValid = false;
  }

  if (!isValid) return;

  try {
    const result = await sendContact(contactData);
    if (result.success) {
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully.",
        icon: "success",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
      });
      contactForm.reset();
    } else {
      Swal.fire({
        title: "Error!",
        text: result.error || "Failed to send message.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "An error occurred while sending the message.",
      icon: "error",
      confirmButtonText: "Retry",
    });
    console.error("Submission error:", error);
  }
});

// helper functions
async function sendContact(contactData) {
  try {
    const res = await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
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

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validatePhone = (phone) => {
  const regex = /^01[0-2,5]\d{8}$/;
  return regex.test(phone.trim());
};

async function getUserId() {
  try {
    const userMail = JSON.parse(localStorage.getItem("currentUser"));
    if (!userMail) {
      console.warn("No user email in localStorage");
      return null;
    }
    const users = await getUsers();
    const user = users.find((u) => u.email === userMail);
    return user?.id || null;
  } catch (error) {
    console.error("Failed to fetch user ID:", error);
    return null;
  }
}

async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}
