const messagesContainer = document.getElementById("msgsTableContainer");
const allMsgsBtn = document.getElementById("all-msgs-btn");
const starredMsgsBtn = document.getElementById("starred-msgs-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const paginationContainer = document.getElementById("paginationControls");
const loader = document.getElementById("loader");

getMessages();
let isStarred = false;
let currentMsgsPage = 1;

async function getMessages(page = 1) {
  const result = await getContacts();
  loader.style.display = "none";
  currentMsgsPage = page;
  if (result.success) {
    const messages = isStarred
      ? result.data.filter((msg) => msg.starred)
      : result.data;

    displaymsgs(messages, {
      inDashboard: true,
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: result.error || "Can't Get messages.",
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
}

function displaymsgs(msgs, options = {}) {
  const {
    currentPage = 1,
    msgsLimit = 10,
    isPagination = true,
    inDashboard,
  } = options;

  const container = inDashboard
    ? document.querySelector("#msgsTableContainer")
    : document.querySelector("#msgsContainer");

  if (!container) return;

  container.classList.add("fade-out");

  setTimeout(() => {
    container.innerHTML = "";

    let msgsToDisplay = msgs;
    if (isPagination && msgsLimit > 0 && msgsLimit < msgs.length) {
      const startIndex = (currentPage - 1) * msgsLimit;
      const endIndex = startIndex + msgsLimit;
      msgsToDisplay = msgs.slice(startIndex, endIndex);
      createPaginationControls(
        msgs.length,
        msgsLimit,
        currentPage,
        inDashboard
      );
    } else {
      paginationContainer.innerHTML = "";
    }

    if (msgsToDisplay.length === 0) {
      if (inDashboard) {
        const noDataMessage = document.createElement("tr");
        noDataMessage.innerHTML = `
              <td colspan="9" class="text-center text-muted">No Messages to display!</td>
            `;
        container.appendChild(noDataMessage);
      } else {
        // No msgs to display Code Here
      }
    } else {
      msgsToDisplay.forEach((msg) => {
        if (inDashboard) {
          createMessageRow(msg, currentPage);
        } else {
          // عرض الكروت لو مش داشبورد
        }
      });
    }

    container.classList.remove("fade-out");
    container.classList.add("fade-in");

    setTimeout(() => {
      container.classList.remove("fade-in");
    }, 500);
  }, 400);
}

function createMessageRow(message, currentPage) {
  const row = document.createElement("tr");
  row.classList.add("message-row");
  row.addEventListener("click", () => {
    updateContact(message.id, { read: true });
    window.location.href = `./message-details.html?id=${message.id}`;
  });
  row.innerHTML = `
    <td><button class="starred-btn" data-id="${message.id}">${
    message.starred
      ? '<i class="fas fa-star text-warning"></i>'
      : '<i class="far fa-star"></i>'
  }</button></td>
    <td>${message.id}</td>
    <td>${message.firstName} ${message.lastName}</td>
    <td class="text-start msg-subject-element">${message.subject}</td>
    <td>${dateFormatter(message.date)}</td>
    <td><button class="btn btn-danger delete-msg-btn" data-id="${
      message.id
    }"><i class="fas fa-trash-alt"></i></button></td>
    `;
  row.querySelector(".delete-msg-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    confirmDelete(message.id);
  });

  row.querySelector(".starred-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    updatingStarredMsg(message.id, { starred: !message.starred }, currentPage);
  });
  messagesContainer.append(row);
}

// buttons events
// all msgs
allMsgsBtn.addEventListener("click", () => {
  isStarred = false;
  getMessages();
  currentMsgsPage = 1;
});

// starred msgs
starredMsgsBtn.addEventListener("click", () => {
  isStarred = true;
  getMessages();
  currentMsgsPage = 1;
});

// DELETE ALL
clearAllBtn.addEventListener("click", () => confirmDeleteAll());

async function confirmDeleteAll() {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete ALL contacts permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete all!",
    cancelButtonText: "Cancel",
  });

  if (isConfirmed) {
    const result = await deleteAllContacts();
    if (result.success) {
      getMessages();
      Swal.fire("Deleted!", "All contacts removed.", "success");
    } else {
      Swal.fire({
        title: "Error!",
        text: result.error || "Can't Delete messages.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  }
}

async function confirmDelete(id) {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete this message permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
  });

  if (isConfirmed) {
    const result = await deleteMessage(id);
    if (result.success) {
      Swal.fire("Deleted!", "Message removed.", "success");
      getMessages();
    } else {
      Swal.fire({
        title: "Error!",
        text: result.error || "Can't Delete messages.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  }
}

async function updatingStarredMsg(id, updatedObj, currentPage) {
  const updateResult = await updateContact(id, updatedObj);
  if (updateResult.success) {
    getMessages(currentPage);
  } else {
    Swal.fire("Error!", updateResult.error, "error");
  }
}

// helper function

function dateFormatter(date) {
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Invalid Date"
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

const createPaginationControls = (
  totalMsgs,
  msgsLimit,
  currentPage,
  inDashboard
) => {
  // cleared const paginationContainer = document.getElementById("paginationControls");
  if (!paginationContainer) return;

  paginationContainer.classList.add("d-flex");
  paginationContainer.innerHTML = "";

  totalMsgs
    ? paginationContainer.classList.remove("d-none")
    : paginationContainer.classList.add("d-none");
  const totalPages = Math.ceil(totalMsgs / msgsLimit);

  // Helper function to create pagination buttons
  const createPageButton = (text, page, disabled = false, isActive = false) => {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm btn-outline--primary ${
      isActive ? "active" : ""
    }`;
    btn.textContent = text;
    btn.disabled = disabled;
    if (isActive) {
      btn.style.pointerEvents = "none"; // Disable click on active button
    }
    btn.addEventListener("click", async () => {
      currentMsgsPage = page;
      const msgsData = await getContacts();
      const messagesToDisplay = isStarred
        ? msgsData.data.filter((msg) => msg.starred)
        : msgsData.data;
      displaymsgs(messagesToDisplay, {
        currentPage: page,
        msgsLimit,
        inDashboard,
      });
    });
    return btn;
  };

  // Previous button
  paginationContainer.appendChild(
    createPageButton("« Previous", currentPage - 1, currentPage === 1)
  );

  // Always show the first page
  paginationContainer.appendChild(
    createPageButton(1, 1, false, currentPage === 1)
  );

  // Show ellipsis (...) if there are many pages before the current page
  if (currentPage - 1 > 2) {
    paginationContainer.appendChild(createPageButton("...", 0, true)); // Disable the "..." button
  }

  // Display only the previous, current, and next pages
  const startPage = Math.max(2, currentPage - 1); // The page before current
  const endPage = Math.min(totalPages - 1, currentPage + 1); // The page after current

  // Append the page buttons to the pagination container
  for (let i = startPage; i <= endPage; i++) {
    const btn = createPageButton(i, i, false, i === currentPage);
    paginationContainer.appendChild(btn);
  }

  // Show ellipsis (...) if there are many pages after the current page
  if (currentPage + 1 < totalPages - 1) {
    paginationContainer.appendChild(createPageButton("...", 0, true)); // Disable the "..." button
  }

  // Always show the last page
  if (totalPages > 1) {
    paginationContainer.appendChild(
      createPageButton(
        totalPages,
        totalPages,
        false,
        currentPage === totalPages
      )
    );
  }

  // Next button
  paginationContainer.appendChild(
    createPageButton("Next »", currentPage + 1, currentPage === totalPages)
  );
};

// APIs
// get all
async function getContacts() {
  try {
    const response = await fetch("http://localhost:3000/contacts");
    if (!response.ok) throw new Error("Failed to fetch contacts.");

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: "Network error. Please try again." };
  }
}

// delete all
async function deleteAllContacts() {
  try {
    const response = await fetch("http://localhost:3000/contacts");
    if (!response.ok) throw new Error("Failed to fetch contacts.");

    const contacts = await response.json();
    await Promise.all(
      contacts.map((contact) =>
        fetch(`http://localhost:3000/contacts/${contact.id}`, {
          method: "DELETE",
        })
      )
    );
    return { success: true, data: contacts };
  } catch (error) {
    console.error(error.message);
    return { success: false, error: `Deletion failed. Please try again.` };
  }
}

// delete one
async function deleteMessage(id) {
  try {
    const response = await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete contact");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("delete error:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
// update
async function updateContact(id, updatedObj) {
  try {
    const response = await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedObj),
    });
    if (!response.ok) throw new Error("Failed to update contact");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
