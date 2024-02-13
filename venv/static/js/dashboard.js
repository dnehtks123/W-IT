// CSV 파일 경로
const csvFilePath = 'wit.csv';


// SVG 차트의 너비와 높이 설정
const width = 800;
const height = 400;

// D3.js를 사용하여 CSV 데이터 로드 및 처리
d3.csv(csvFilePath).then(function(data) {
    data.forEach(function(d) {
        d.Month = +d.Month;
        d['Water Temperature'] = +d['Water Temperature'];
    });

    const monthlyData = d3.rollup(data, v => d3.mean(v, d => d['Water Temperature']), d => d.Month);

    const monthlyArray = Array.from(monthlyData, ([key, value]) => ({ month: key, temperature: value }));

    const svg = d3.select("#monthly-temperature-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleBand()
        .domain(monthlyArray.map(d => d.month))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(monthlyArray, d => d.temperature)])
        .range([height, 0]);

    svg.selectAll(".bar")
        .data(monthlyArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.temperature))
        .attr("height", d => height - yScale(d.temperature));
});
