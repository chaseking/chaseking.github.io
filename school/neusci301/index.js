window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

const I = (g, V_m, V_ion) => g * (V_m - V_ion)

var config = {
    type: 'line',
    data: {
        labels: [-100, -75, 100],
        datasets: [{
            label: 'Unfilled',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [
                1, 2, 3, 4, 5, 6, 7
            ],
        }, {
            label: 'Dashed',
            fill: false,
            backgroundColor: window.chartColors.green,
            borderColor: window.chartColors.green,
            borderDash: [5, 5],
            data: [
                1, 2, 3, 4, 5, 6, 7
            ],
        }, {
            label: 'Filled',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [
                1, 2, 3, 4, 5, 6, 7
            ],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Current flow for ions'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Membrane potential (mV)'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Ion current'
                }
            }]
        }
    }
};

window.onload = function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    window.myLine = new Chart(ctx, config);
};