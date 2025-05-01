const notificationDropdownList = document.getElementById("notificationDropdownList");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationCount = document.getElementById("notificationCount");

async function displayNotification() {
  const response = await getContacts();
  if (response.success) {
    const messages = response.data;
    const unreadMsgs = messages.filter((msg) => !msg.read);
    if (unreadMsgs.length > 0) {
    //   notificationCount.textContent = unreadMsgs.length;
      notificationCount.classList.add("bg-danger");
    }
    const header = document.createElement("li");
    header.className = "dropdown-header p-2 text-dark text-center";
    const h3 = document.createElement("h5");
    h3.innerHTML = `Messages Notifications`
    header.append(h3);
    notificationDropdownList.append(header);
    messages.forEach((msg) => {
        const notificationCard = createNotificationCard(msg);
        notificationDropdownList.appendChild(notificationCard);
      });
  } else {
    console.log(response.error);
  }
}

displayNotification();

notificationDropdown.addEventListener("click",() => {
    notificationCount.classList.remove("bg-danger");
})

function createNotificationCard(msg) {
  const notificationItem = document.createElement("li");
  notificationItem.classList.add("dropdown-item", "d-flex","flex-column", "notification");
  notificationItem.classList.add(msg.read ? "read" : "unread");
  notificationItem.innerHTML = `<div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0 fw-bold">${msg.firstName} ${msg.lastName}</h6>
                        <p class="text-muted mb-0">${dateFormatter(msg.date)}</p>
                      </div>
                      <p class="notification-subject overflow-x-hidden">${msg.subject}</p>`;
    notificationItem.addEventListener("click", () => {
      window.location.href = `./notification-details.html?id=${msg.id}`
    })
  return notificationItem;
}

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

// edit all messages to be readed


function dateFormatter(date) {
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Invalid Date"
    : d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
}
