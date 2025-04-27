


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
                        label: 'Booking Status Distribution',
                        data: status,
                        borderWidth: 2,
                        borderColor: '#fff', // White border for each slice
                        backgroundColor: ['#28a745', '#dc3545', '#ffc107'], // Green, Red, Yellow for each status
                        hoverBackgroundColor: ['#218838', '#c82333', '#e0a800'], // Darker shades for hover effect
                        hoverBorderColor: '#fff', // Border color when hovered
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1500, // Longer animation time for a smoother effect
                        easing: 'easeOutElastic', // Elastic easing for the animation effect
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
                            display: true,
                            text: 'Different booking status comparison',
                            font: {
                                size: 20
                            },
                            color: '#333'
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
            console.log(carsLabels);
        
            const ctx = document.getElementById('myChart-3');
        
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: carsLabels,
                    datasets: [{
                        label: 'Booking Duration (Days)',
                        data: bookingsTime,
                        fill: true, // 👉 Fills the area under the line for a smooth look
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue background
                        borderColor: 'rgba(54, 162, 235, 1)', // Stronger blue border
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Points color
                        pointBorderColor: '#fff', // Point border color
                        pointHoverBackgroundColor: '#fff', // Hover color
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.4, // 👉 Smooth curved lines
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Better responsiveness
                    plugins: {
                        title: {
                            display: true,
                            text: 'Confirmed Booking Durations',
                            font: {
                                size: 20
                            },
                            color: '#333'
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
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Booking ID',
                                color: '#666',
                                font: {
                                    weight: 'bold',
                                    size: 16
                                }
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(200,200,200,0.2)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Duration (Days)',
                                color: '#666',
                                font: {
                                    weight: 'bold',
                                    size: 16
                                }
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12
                                },
                                stepSize: 1 // Force nice steps
                            },
                            grid: {
                                color: 'rgba(200,200,200,0.2)'
                            },
                            beginAtZero: true
                        }
                    },animation: {
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
                        borderWidth: 2,
                        borderColor: '#0d6efd', // Blue color for the border
                        backgroundColor: 'skyblue', // Fill color for the bars
                        hoverBackgroundColor: '#4c99e6', // Hover color
                        hoverBorderColor: '#004085', // Hover border color
                        borderRadius: 8, // Rounded corners for bars
                        barPercentage: 0.7, // Control the width of the bars
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
                        title: {
                            display: true,
                            text: 'Different cars cost comparison',
                            font: {
                                size: 20
                            },
                            color: '#333'
                        },
                        legend: {
                            display: true,
                            labels: {
                                font: {
                                    weight: 'bold',
                                    size: 16
                                },
                            },
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Car ID',
                                font: {
                                    weight: 'bold',
                                    size: 14
                                },
                                color: '#555',
                            },
                            ticks: {
                                font: {
                                    size: 12,
                                    weight: 'bold',
                                },
                                color: '#555'
                            },
                            grid: {
                                display: false, // Hide grid lines for the x-axis
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price per day (EGP)',
                                font: {
                                    weight: 'bold',
                                    size: 14
                                },
                                color: '#555'
                            },
                            ticks: {
                                beginAtZero: true,
                                font: {
                                    size: 12,
                                    weight: 'bold',
                                },
                                color: '#555',
                            },
                            grid: {
                                color: '#ddd', // Light gray grid lines
                                lineWidth: 1
                            }
                        }
                    }
                }
            });
        }
        
        gettingPrices();
        
        
        
        


    } catch { }



}
loadData_2()