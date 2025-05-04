document.addEventListener("DOMContentLoaded", () => {
  // Clean the email from localStorage to remove extra quotes or whitespace
  let currentUserEmail = localStorage.getItem("currentUser");
  if (currentUserEmail) {
    currentUserEmail = currentUserEmail.replace(/^"|"$/g, "").trim();
  }
  console.log("Current User Email (cleaned):", currentUserEmail);

  if (!currentUserEmail) {
    Swal.fire({
      icon: "error",
      title: "Not Logged In",
      text: "Please log in to view your profile.",
      confirmButtonText: "Go to Login",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  // Fetch user data
  Promise.all([
    fetch("http://localhost:3000/users").then((res) => res.json()),
  ]).then(([users]) => {
    console.log("Fetched users:", users);
    const user = users.find((u) => u.email === currentUserEmail);

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "User Not Found",
        text: "No user found with this email. Please log in again.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
      });
      return;
    }

    // Update profile header
    document.getElementById("headerName").textContent = user.name;
    if (user.image) {
      document.getElementById("profileImage").src = user.image;
    }

    // Update profile details
    document.getElementById("profileDetails").innerHTML = `
                 <div class="form-like-fields">
                    <div class="info-item">
                        <label class="info-label">Full Name</label>
                        <div class="info-value">${user.name}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Email Address</label>
                        <div class="info-value">${user.email}</div>
                    </div>
                    <div class="info-item">
                        <label class="info-label">Phone Number</label>
                        <div class="info-value">${
                          user.phone || "Not provided"
                        }</div>
                    </div>
                    
                </div>
            `;

    // Set edit profile link
    const editProfileBtn = document.getElementById("editProfileBtn");
    if (user.role === "admin") {
      editProfileBtn.href = "/admin/settings.html";
    } else {
      editProfileBtn.href = "/user-profile-edit.html";
    }
  });
});
