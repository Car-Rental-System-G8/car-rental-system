


async function loadData() {
    try {
        const response = await fetch('http://localhost:3000/bookings');
        if (!response) throw new Error('Network response was not ok');
        const data = await response.json();

        const bookings = data;

        function gettingStatus() {
            let confirmed = 0
            let canceled = 0
            let pending = 0
            let statusName = ["Confirmed", "Canceled", "Pending"]
            for (let i in bookings) {
                if (bookings[i].status == "confirmed") { confirmed += 1 }
                if (bookings[i].status == "canceled") { canceled += 1 }
                if (bookings[i].status == "pending") { pending += 1 }
            }
            let status = [confirmed, canceled, pending]
        
            const ctx = document.getElementById('myChart-2');
        
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: statusName,
                    datasets: [{
                        data: status,
                        borderWidth: 0,
                        borderColor: '#fff', // White border for each slice
                        backgroundColor: ['#4caf50', '#f44336', '#ffc107'],
                        hoverBackgroundColor: ['#329536', '#de3225', '#edb717'],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                weight: 'bold',
                                size: 14
                            },
                            bodyFont: {
                                size: 12
                            },
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw} bookings`;
                                }
                            }
                        },
                        datalabels: {
                            formatter: (value, context) => {
                                let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                let percentage = (value * 100 / sum).toFixed(1) + "%";
                                return percentage;
                            },
                            color: '#fff', // Label text color
                            font: {
                                weight: 'bold',
                                size: 14
                            },
                            align: 'center', // Center align the labels in the pie slices
                            anchor: 'center', // Center anchor position
                        },
                        title: {
                            display: false,
                        }
                    }
                }
            });
        }        
        gettingStatus();
        
        // __________________________________________________________

        // __________________________________________________________
        function bookingTime() {
            let bookingsTime = [];
            let carsLabels = [];
            
            for (let i in bookings) {
                if (bookings[i].status === "confirmed") {
                    let pickup = new Date(bookings[i].pickupDate);
                    let returnD = new Date(bookings[i].returnDate);
                    let diffInMs = returnD - pickup;
                    let diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        
                    carsLabels.push(`Booking ID-${bookings[i].id}`); 
                    bookingsTime.push(diffInDays);
                }


            }
        
            const ctx = document.getElementById('myChart-3');
        
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: carsLabels,
                    datasets: [{
                        label: 'Booking Duration (Days)',
                        data: bookingsTime,
                        fill: true, // 👉 Fills the area under the line for a smooth look
                        backgroundColor: 'rgba(48, 71, 224, 0.1)', // Light blue background
                        borderColor: '#3047E0', // Stronger blue border
                        pointBackgroundColor: '#3047E0', // Points color
                        pointBorderColor: '#fff', // Point border color
                        pointHoverBackgroundColor: '#fff', // Hover color
                        pointHoverBorderColor: '#3047E0',
                        tension: 0.4, // 👉 Smooth curved lines
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Better responsiveness
                    plugins: {
                        title: {
                            display: false,
                        },
                        legend: {
                            display: true,
                            labels: {
                                color: '#555',
                                font: {
                                    weight: 'bold',
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            titleColor: '#fff',
                            bodyColor: '#eee',
                            cornerRadius: 4,
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuad '
                    },
                }
            });
        }
        bookingTime();

        // _____________________________---
        
    } catch { }



}
loadData()

// -----------------------------------------------------------------------------------
async function loadData_2() {
    try {
        const response = await fetch('http://localhost:3000/cars');
        if (!response) throw new Error('Network response was not ok');
        const data = await response.json();

        const cars = data;

        function gettingPrices() {
            let prices = []
            let carsLabels = []
            for (let i in cars) {
                prices.push(cars[i].pricePerDay)
                carsLabels.push(`car ID-${cars[i].id}`)
            }
        
            const ctx = document.getElementById('myChart-1');
        
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: carsLabels,
                    datasets: [{
                        label: 'Car Cost per day',
                        data: prices,
                        borderWidth: 1,
                        borderColor: '#3047E050', // Blue color for the border
                        backgroundColor: '#3047E0',
                        hoverBackgroundColor: 'rgba(48, 71, 224, 0.8)', // Hover color
                        hoverBorderColor: '#3047E050', // Hover border color
                        borderRadius: 0, // Rounded corners for bars
                        barPercentage: 0.5, // Control the width of the bars
                        categoryPercentage: 0.8, // Control the space between bars
                        
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuad',
                    },
                    plugins: {
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                weight: 'bold',
                                size: 14
                            },
                            bodyFont: {
                                size: 12
                            },
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Price per day: EGP ${tooltipItem.raw}`;
                                }
                            }
                        },
                        legend: {
                            display: false,
                        }
                    },
                }
            });
        }
        
        gettingPrices();
        
    } catch { }

}
loadData_2()