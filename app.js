// Chart.js를 활용한 그래프 생성 및 업데이트 함수
function createChart(canvasId, label, backgroundColor, borderColor) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });

    return chart;
}

// 서버로부터 데이터를 가져와 그래프를 업데이트하는 함수
function updateChart(chart, canvasId, url) {
    // AJAX를 활용하여 서버로부터 데이터 가져오기
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var labels = data.labels;
            var dataValues = data.data;

            // 그래프 데이터 업데이트
            chart.data.labels = labels;
            chart.data.datasets[0].data = dataValues;
            chart.update();
        }
    };
    xhr.send();
}

// 페이지 로드 시 실행되는 함수
window.onload = function () {
    var temperatureChart = createChart('temperatureChart', 'Temperature', 'rgba(54, 162, 235, 0.7)', 'rgba(54, 162, 235, 1)');
    var humidityChart = createChart('humidityChart', 'Humidity', 'rgba(75, 192, 192, 0.7)', 'rgba(75, 192, 192, 1)');
    var turbidityChart = createChart('turbidityChart', 'Turbidity', 'rgba(91, 179, 45, 0.7)', 'rgba(91, 179, 45, 1)');
    var phChart = createChart('phChart', 'ph', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 99, 132, 1)');

    setInterval(function () {
        updateChart(temperatureChart, 'temperatureChart', '/temperature_data');
        updateChart(humidityChart, 'humidityChart', '/humidity_data');
        updateChart(turbidityChart, 'turbidityChart', '/turbidity_data');
        updateChart(phChart, 'phChart', '/ph_data');
    }, 500); // 0.5초마다 그래프 업데이트
};


// // "Databases" 버튼 요소를 가져와서 클릭 이벤트를 설정합니다.
// var databaseButton = document.getElementById('databaseButton');
// databaseButton.addEventListener('click', function () {
// // 새로운 데이터베이스 페이지의 내용을 동적으로 생성합니다.
// var databasePageContent = document.createElement('div');
// databasePageContent.innerHTML = '<h1>Welcome to the Database Page</h1><p>This is the content of the database page.</p>';

// // 새로운 데이터베이스 페이지의 스타일을 설정합니다.
// databasePageContent.style.padding = '20px';
// databasePageContent.style.backgroundColor = 'lightgray';

// // 새로운 데이터베이스 페이지를 body에 추가합니다.
// document.body.innerHTML = '';
// document.body.appendChild(databasePageContent);

// // 새로운 데이터베이스 페이지로 스크롤합니다.
// window.scrollTo(0, 0);
// });