const {select, csv, scaleLinear, scaleBand, max, axisLeft, axisBottom, format} = d3


const svg = select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');


const render = data => {
    
    const xValue = d => d.population
    const yValue = d => d.country

    const margin = {top: 50, right: 40, bottom: 70, left: 100}
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;


    // Creating a container group element in svg
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)


    // Defining X Scale using scaleLinear()
    const xScale = scaleLinear()
                    .domain([0, max(data, d => xValue(d))])
                    .range([0, innerWidth]);


    // Defining Y Scale using scaleBand()
    const yScale = scaleBand()
                    .domain(data.map(d => yValue(d)))
                    .range([0, innerHeight])
                    .padding(0.1);

    // Formatting X axis labels
    const xAxisTickFormat = number => format('.3s')(number).replace('G', "B")


    // Defining X axis logic
    const xAxis = axisBottom(xScale)
                .tickFormat(xAxisTickFormat)
                .tickSize(-innerHeight);
    

    // Defining Y Axig svg group element
    const yAxisG = g.append('g').call(axisLeft(yScale));

    // Defining X Axis svg group element
    const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(${0}, ${innerHeight})`)

    // Removing Removing domain line from X axis
    xAxisG.select('.domain')
        .remove();
    
    // Removing Domain and tick lines Y axis
    yAxisG.selectAll('.domain, .tick line').remove();

    xAxisG.append('text')
        .attr('class', 'axis-lable')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Population')

    // Creating Bars
    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('height', yScale.bandwidth())
        .attr('width', d => xScale(xValue(d)))


    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text('Top 10 Most Popular Countries');


}



// Reading the data from CSV
csv('data.csv').then(data => {

    // Converting population string to number
    data.forEach(d => {
        d.population = +d.population * 1000;
    })


    // Calling render 
    render(data) 
})