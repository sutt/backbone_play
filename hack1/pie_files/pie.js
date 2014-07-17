var width = 500,
		height = 500,
		radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();

/* https://github.com/mbostock/d3/blob/master/lib/colorbrewer/colorbrewer.js */
var arr = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
	var my_color = function(i) {
		return arr[Math.round(Math.random()*arr.length)];
		return arr[i & arr.length];
	}
	
	var pie = d3.layout.pie()
		//.value(function(d) { return d.apples; })
		.value(function(d) { return d.geneLen; })
		.sort(null);
	
	
	var pie2 = d3.layout.pie()
		.value(function(d) { return d; })
		.sort(null);
	
	var arc = d3.svg.arc()
		.innerRadius(radius - 60)
		.outerRadius(radius - 20);

	var arctwo = d3.svg.arc()
		.innerRadius(radius - 100)
		.outerRadius(radius - 60);
		
	var svg = d3.select("#donut")
	  .append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
	    .attr("id", "outerWheel");
	
	var svg2 = d3.select("#donut") 
	  .append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("id", "innerWheel");
	
	var outerLabels = d3.select("#donut").append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("class", "labels");
	
	d3.json("ggboth.json", function(error, data) {

		myDebug = data;
		
		d3.selectAll("#rotate_input")
		   .on("click", rotate_outer);
		
		d3.selectAll("g").on("click", rotate_outer);
		  
		
		var myStr = 'outsideGenes' ;
		single_data = _.filter(data, function(x) { 
										return x[myStr]; } )[0][myStr];
		
		my_data = single_data.map( function(x) {
					return {"geneLen":x.geneLen, 
							"geneName":x.geneName};
							});
		//my_id = single_data.map( function(x) {return x.geneName;});
		myDebug = my_data;
		
		var path = svg.datum(my_data).selectAll("path")
		  .data(pie)
		.enter().append("path")
		  .attr("fill", function(d, i) {  return my_color( i )})
		  .attr("d", arc)
		  .attr("id", function(d,i) { return d.data.geneName})
		  .each(function(d) { this._current = d; }); // store the initial angles
		
		
		var myStr = 'insideGenes' ;
		single_data2 = _.filter(data, function(x) { 
										return x[myStr]; } )[0][myStr];
		my_data2 = single_data2.map( function(x) {return x.geneLen;});
		myDebug2 = my_data2;
		
		var path2 = svg2.datum(my_data2).selectAll("path")
		  .data(pie2)
		.enter().append("path")
		  .attr("fill", function(d, i) {  return my_color( i )})
		  .attr("d", arctwo)
		  .each(function(d) { this._current = d; }); // store the initial angles
	
		/*
		var key = function(d){ return d.data.geneName; };
		
		var text = d3.select('#outerWheel')
					 .select(".labels")
					 .selectAll("text")
						.data(pie(my_data), key);
		
		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function(d) {
				return d.data.geneName;
			});
		*/
	}
	
	function rotate_outer() {
		
		pie.startAngle(.5);
		pie.endAngle(function() { return (Math.PI * 2) + .5});
		
		newpath = svg //datum(myDebug).selectAll('path')
			.selectAll('path')
			.data(pie)
			//.enter() //.append('path')
			.attr("d",arc);
		
		newpath.transition().duration(750).attrTween("d",arcTween);
		//newpath.transition().duration(750).styleTween("fill",fillTween);

	}
		
	});
	
	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  console.log(a);
	  this._current = i(0);
	  return function(t) {
		console.log(t);
		return arc(i(t));
	  };
	}

	function fillTween(a) {
	  //var i = d3.interpolate(this._current, a);
	  console.log(this.style('fill'));
	  //this._current = i(0);
	  return function(t) {		
		return arr[Math.round(t*7)];
	  };
	}
