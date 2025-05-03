
# 🚗 Car Rental System

A responsive and interactive web application that allows users to browse, book, and manage car rentals while providing administrative tools for overseeing the system. Built with modern web technologies, it supports role-based access, dark mode, and interactive dashboards.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Car-Rental-System-G8/car-rental-system.git
cd car-rental-system
```

### 2. Install JSON Server (if not installed)

```bash
npm install -g json-server
```

### 3. Start Backend Server

```bash
json-server --watch db.json
```

### 4. Open in Browser Using Live Server

To open the project using Live Server:

1. Install **Live Server** extension in VS Code.
2. Right-click on `index.html` (for customer view) or `admin.html` (for the admin dashboard).
3. Select **Open with Live Server**.

---

## 🔧 Technologies Used

- HTML5 & CSS3
- JavaScript (ES6)
- Bootstrap (local files)
- jQuery
- Font Awesome (as files)
- Google Fonts (imported as files)
- SweetAlert2
- Toastr
- Chart.js
- JSON Server (for backend simulation)

---

## 📦 Features

### 🔐 User Features

- **Register/Login**: Create an account with email, password, and phone number.
- **Session Management**: Uses localStorage to manage user sessions.
- **Car Browsing**: View all available cars, with filtering by name, brand, price, and availability.
- **Search & Recommendations**: Tailored recommendations based on selected car specs.
- **Booking**: Choose rental dates and get booking confirmation with conflict checks.
- **Favorites**: Save cars to a personal favorites list.
- **Profile Management**: View and edit user details.
- **Booking History**: See a history of previous bookings.
- **Reviews**: View and submit reviews for cars.
- **Checkout**: Calculates total cost based on rental duration and car.
- **Dark Mode**: Toggle between light and dark themes.

### 🛠 Admin Features

- **Admin Dashboard**: Accessible via admin login (defined in db.json).
- **Car Management**: Add, edit, delete car listings.
- **Booking Management**: View, confirm, or delete bookings.
- **Contact Messages**: View user-submitted queries and issues.
- **Analytics Dashboard**: Visual reports for bookings, profits, availability using Chart.js.
- **Toastr Alerts**: Admin gets instant alerts for user interactions.

---

This will open the project in your browser with live reloading.

📂 **File Structure (No CDN Usage)**

All assets like Bootstrap, jQuery, Font Awesome, and Google Fonts are imported locally as files to ensure offline compatibility and faster performance.

✉ **Contact**

For questions or contributions, feel free to open an issue or submit a pull request.
