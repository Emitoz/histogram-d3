async function draw() {
  // Data
  const dataset = await d3.json('data.json')

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50,
    padding: 1
  };

  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.length;

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Scale
  const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])
      .nice()

  const bin = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10)

  const newDataset = bin(dataset);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(newDataset, yAccessor)])
      .range([dimensions.height, 0])
      .nice()
  
  // Draw bars
  ctr.selectAll("rect")
      .data(newDataset)
      .join("rect")
      .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0 ) - dimensions.padding]))
      .attr("height", d => dimensions.height - yScale(yAccessor(d)))
      .attr("x", (d) => xScale(d.x0))
      .attr("y", d => yScale(yAccessor(d)))
      .attr("fill", "blue")

  // Draw axis
  const xAxis = d3.axisBottom(xScale);

  const xAxisGroup = ctr.append("g")
      .style(
        "transform",
        `translateY(${dimensions.ctrHeight}px)`
      )
  xAxisGroup.call(xAxis)

}

draw()