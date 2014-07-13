var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();

	var pie = d3.layout.pie()
		//.value(function(d) { return d.apples; })
		.value(function(d) { return d; })
		.sort(null);

	var arc = d3.svg.arc()
		.innerRadius(radius - 60)
		.outerRadius(radius - 20);

	var svg = d3.select("#donut") //.append("svg")
		//.attr("width", width)
		//.attr("height", height)
	  .append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	/*
	d3.tsv("pie_files/data.tsv", type, function(error, data) {
		var randColor = Math.round(Math.random()*10);
		console.log(data.apples);
		var path = svg.datum(data).selectAll("path")
		  .data(pie)
		.enter().append("path")
		  .attr("fill", function(d, i) { return color( i )})
		  .attr("d", arc)
		  .each(function(d) { this._current = d; }); // store the initial angles

	  d3.selectAll("#apples_input")
		  .on("change", change);

	  d3.select("#rotate_input")
			.on("click", rotate_donut )
	  
	  var timeout = setTimeout(function() {
		d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
	  }, 6000);
	  
	  function rotate_donut() {
		value = 'apples';
		pie.startAngle(.333);
		pie.endAngle(function() { return (Math.PI * 2) + .333});
		//pie.value(function() { return pie.value()} );
		//pie.value(function(d) { return d[value]; }); // change the value function
		//path = path.data(pie); // compute the new angles
		console.log(pie.value());
		console.log();
		path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
	  }
	  
	  function change() {
		var value = this.value;
		clearTimeout(timeout);  
		pie.value(function(d) { return d[value]; }); // change the value function
		path = path.data(pie); // compute the new angles
		path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
	  }
	});
	*/
	//d3.json("jsonStart.json", function(error, data) {
	d3.json("gl0.json", function(error, data) {
		
		console.log(error);
		console.log(data);
		myDebug = data;
		my_data = data.map( function(x) {return x.geneStart;});
		var path = svg.datum(my_data).selectAll("path")
		  .data(pie)
		.enter().append("path")
		  .attr("fill", function(d, i) { return color( i )})
		  .attr("d", arc)
		  .each(function(d) { this._current = d; }); // store the initial angles
		
	});
	
	
	function type(d) {
	  d.apples = +d.apples;
	  d.oranges = +d.oranges;
	  return d;
	}

	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
		return arc(i(t));
	  };
	}
