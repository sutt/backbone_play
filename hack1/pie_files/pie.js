var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();
var arr = ['#ffffff',
'#f0f0f0',
'#d9d9d9',
'#bdbdbd',
'#969696',
'#737373',
'#525252',
'#252525',
'#000000'];
	//var arr = ['rgb(247,252,253)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)'];
	//var arr =['rgb(247,252,253)','rgb(224,236,244)','rgb(191,211,230)','rgb(158,188,218)','rgb(140,150,198)','rgb(140,107,177)','rgb(136,65,157)','rgb(129,15,124)','rgb(77,0,75)'];
	//var arr =['rgb(255,255,255)','rgb(240,240,240)','rgb(217,217,217)','rgb(189,189,189)','rgb(150,150,150)','rgb(115,115,115)','rgb(82,82,82)','rgb(37,37,37)','rgb(0,0,0)'];
	var my_color = function(i) {
		//return arr[i % arr.length];
		return arr[Math.round(Math.random()*arr.length)];
	}
	
	var pie = d3.layout.pie()
		//.value(function(d) { return d.apples; })
		.value(function(d) { return d; })
		.sort(null);
	
	var pie2 = d3.layout.pie()
		//.value(function(d) { return d.apples; })
		.value(function(d) { return d; })
		.sort(null);
	
	var arc = d3.svg.arc()
		.innerRadius(radius - 60)
		.outerRadius(radius - 20);

	var arc2 = d3.svg.arc()
		.innerRadius(radius - 100)
		.outerRadius(radius - 60);
		
	var svg = d3.select("#donut") //.append("svg")
		//.attr("width", width)
		//.attr("height", height)
	  .append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	var svg2 = d3.select("#donut") //.append("svg")
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
	d3.json("ggboth.json", function(error, data) {
		
		console.log(error);
		console.log(data);
		myDebug = data;
		
		// d3.selectAll("#apples_input")
		  // .on("change", change);
		  
		var myStr = 'outsideGenes' ;
		single_data = _.filter(data, function(x) { 
										return x[myStr]; } )[0][myStr];
		
		my_data = single_data.map( function(x) {return x.geneLen;});
		myDebug = my_data;
		var path = svg.datum(my_data).selectAll("path")
		  .data(pie)
		.enter().append("path")
		  .attr("fill", function(d, i) {  return my_color( i )})
		  .attr("d", arc)
		  .each(function(d) { this._current = d; }); // store the initial angles
		
		var myStr = 'insideGenes' ;
		single_data2 = _.filter(data, function(x) { 
										return x[myStr]; } )[0][myStr];
		my_data2 = single_data2.map( function(x) {return x.geneLen;});
		myDebug2 = my_data2;
		//var path = svg2.datum(my_data2['geneLen']).selectAll("path")
		var path = svg2.datum(my_data2).selectAll("path")
		  .data(pie2)
		.enter().append("path")
		  .attr("fill", function(d, i) {  return my_color( i )})
		  .attr("d", arc2)
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
