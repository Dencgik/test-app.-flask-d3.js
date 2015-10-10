$( document ).ready(function() {

var margin = { top: 20, right: 10, bottom: 100, left: 60 },
		width = 1200 - margin.right - margin.left,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("body")
		.append('svg')
		.attr({
				"width" : width + margin.right + margin.left,
				"height" : height + margin.top + margin.bottom
		})
		.append('g')
			.attr("transform", "translate(" + margin.left +',' + margin.right + ')');
var xScale = d3.scale.ordinal()
		.rangeRoundBands([0,width], 0.2, 0.2);

var yScale = d3.scale.linear()
		.range([height, 0]);

var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")

d3.json("/cities/", function(error, data){
	if (error) console.log('Dont load data!');

	data.forEach(function(d){
		d.city = d._id
		d.population = d.population/1000
	});

	data.sort(function(a,b){
		return b.population - a.population
	});

	xScale.domain(data.map(function(d){ return d.city; }));
	yScale.domain([0, d3.max(data, function(d){ return d.population; })]);

	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('height', 0)
		.attr('y', height)
		.transition().duration(3000)
		.delay(function(d, i) { return i * 200; })
		.attr({
			'x': function(d){ return xScale(d.city); },
			'y': function(d){ return yScale(d.population); },
			'width': xScale.rangeBand(),
			'height': function(d) { return height- yScale(d.population); }
		})
		.style('fill', function(d, i) { return 'rgb(20, 20, ' + ((i * 30) + 100) + ')'})

	svg.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.text(function(d) { return d.population.toFixed(1); })
		.attr('x', function(d) { return xScale(d.city) + xScale.rangeBand()/2; })
		.attr('y', function(d) { return yScale(d.population) + 12; })
		.attr('fill', 'white')
		.attr('text-anchor', 'middle');

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis)
		.selectAll('text')
		.attr('transform', 'rotate(-60)')
		.attr('dx', '-.8em')
		.attr('dy', '.25em')
		.style('text-anchor', 'end')
		.style('font-size', '12px');

	svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.style('font-size', '12px');

});
	/*d3.json("/cities/", function(data){
		var canvas = d3.select("body").append("svg")
					.attr("width", 1000)
					.attr("height", 1000)
		canvas.selectAll("rect")
					.data(data)
					.enter()
							.append("rect")
							.attr("width", function(d){ return d.population/5000; })
							.attr("height", 48)
							.attr("y", function(d, i) { return i*50; })
							.attr("fill", "blue");
		canvas.selectAll("text")
				.data(data)
				.enter()
						.append("text")
						.attr("fill", "white")
						.attr("y", function(d,i) { return i*50+30; })
						.text(function (d) { return d._id; })
	});
*/
});