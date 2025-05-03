function loadBookings() {
    Promise.all([
        fetch('http://localhost:3000/bookings').then(res => res.json()),
        fetch('http://localhost:3000/users').then(res => res.json()),
        fetch('http://localhost:3000/cars').then(res => res.json())
    ])
        .then(([bookings, users, cars]) => {
            const tableBody = document.getElementById('carsTableContainer');
            tableBody.innerHTML = '';

            bookings.forEach((booking, index) => {
                const user = users.find(user => user.id === booking.userId);
                const userName = user ? user.name : 'Unknown User';

                const car = cars.find(car => car.id === booking.carId);
                const carName = car ? `${car.brand} ${car.model}` : 'Unknown Car';
                const carImage = car ? car.image : 'https://placehold.co/100x100';

                const pickupDate = booking.pickupDate;
                const returnDate = booking.returnDate;

                const totalCost = booking.totalCost;
                let status = booking.status;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${userName}</td>
                     <td><img src="${carImage}" alt="${carName}" style="width: 100px; height: 50px; object-fit: cover;" /></td>
                    <td>${carName}</td>
                    <td>From: ${pickupDate} to: ${returnDate}</td>
                    <td>$${totalCost}</td>
                    <td>
                        <select class="form-select form-select-sm status-select badge ${
                            status === 'confirmed' ? 'bg-success' :
                            status === 'pending' ? 'bg-warning' :
                            status === 'canceled' ? 'bg-danger' : 'bg-secondary'
                        }" style="width: auto;" data-index="${index}" data-booking-id="${booking.id}">
                            <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="canceled" ${status === 'canceled' ? 'selected' : ''}>Canceled</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-btn" data-booking-id="${booking.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Add event listeners for status dropdowns
            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', (event) => {
                    const index = event.target.getAttribute('data-index');
                    const bookingId = event.target.getAttribute('data-booking-id');
                    const newStatus = event.target.value;
                    const previousStatus = event.target.querySelector(`option[selected]`)?.value || event.target.querySelector('option').value;

                    Swal.fire({
                        title: 'Are you sure?',
                        text: `Do you want to update the status to "${newStatus}"?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`http://localhost:3000/bookings/${bookingId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ status: newStatus })
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Failed to update status: ${response.statusText}`);
                                    }
                                    return response.json();
                                })
                                .then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Status Updated',
                                        text: `Booking status has been updated to "${newStatus}".`,
                                        timer: 1500,
                                        showConfirmButton: false
                                    });
                                    loadBookings();
                                })
                                .catch(error => {
                                    console.error('Error updating status:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Failed to update status. Please try again.',
                                    });
                                    event.target.value = previousStatus;
                                });
                        } else {
                            event.target.value = previousStatus;
                        }
                    });
                });
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const bookingId = event.target.closest('.delete-btn').getAttribute('data-booking-id');

                    Swal.fire({
                        title: 'Are you sure?',
                        text: 'Do you want to delete this booking?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`http://localhost:3000/bookings/${bookingId}`, {
                                method: 'DELETE'
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Failed to delete booking: ${response.statusText}`);
                                    }
                                    return response.json();
                                })
                                .then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Deleted!',
                                        text: 'The booking has been deleted.',
                                        timer: 1500,
                                        showConfirmButton: false
                                    });
                                    loadBookings();
                                })
                                .catch(error => {
                                    console.error('Error deleting booking:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Failed to delete booking. Please try again.',
                                    });
                                });
                        }
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            const tableBody = document.getElementById('carsTableContainer');
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading booking data: ${error.message}</td></tr>`;
        });
}

document.addEventListener('DOMContentLoaded', loadBookings);