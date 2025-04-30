const messagesContainer = document.getElementById("msgsTableContainer");
const clearAllBtn = document.getElementById("clear-all-btn");

async function displayMessages() {
  messagesContainer.innerHTML = "";
  const result = await getContacts();
  if (result.success) {
    const messages = result.data;
    if(messages.length === 0){
        const noDataMessage = document.createElement("tr");
        noDataMessage.innerHTML = `
          <td colspan="9" class="text-center text-muted">No Messages to display!</td>
        `;
        messagesContainer.appendChild(noDataMessage);
        return;
    }
    messages.forEach((message) => {
      createMessageRow(message);
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

displayMessages();

function createMessageRow(message) {
  const row = document.createElement("tr");
  row.classList.add("message-row");
  row.addEventListener("click", () => {
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
    updatingStarredMsg(message.id, { starred: !message.starred });
  });
  messagesContainer.append(row);
}

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
      displayMessages();
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
        displayMessages();
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

async function updatingStarredMsg(id, updatedObj) {
  const updateResult = await updateContact(id, updatedObj);
  if (updateResult.success) {
    displayMessages();
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
