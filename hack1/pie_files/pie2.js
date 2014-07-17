var width = 600,
		height = 600,
		radius = 250; //Math.min(width, height) / 2;

	var color = d3.scale.category20();

/* https://github.com/mbostock/d3/blob/master/lib/colorbrewer/colorbrewer.js */
var arr = ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];
	//var arr = ['rgb(247,252,253)','rgb(229,245,249)','rgb(204,236,230)','rgb(153,216,201)','rgb(102,194,164)','rgb(65,174,118)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)'];
	//var arr =['rgb(247,252,253)','rgb(224,236,244)','rgb(191,211,230)','rgb(158,188,218)','rgb(140,150,198)','rgb(140,107,177)','rgb(136,65,157)','rgb(129,15,124)','rgb(77,0,75)'];
	//var arr =['rgb(255,255,255)','rgb(240,240,240)','rgb(217,217,217)','rgb(189,189,189)','rgb(150,150,150)','rgb(115,115,115)','rgb(82,82,82)','rgb(37,37,37)','rgb(0,0,0)'];
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
		.attr("width",600)
		.attr("height",600)
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

	function pop_gene(geneList) {
		geneList.forEach( function(g) {
			svg.selectAll('path')
				.selectAll(g.geneName)
				.attr("fill", '#000000')

		});
	}
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}	
	var key = function(d){ return d.data.geneLen; };
	
	var outerArc = d3.svg.arc()
		.innerRadius(radius -40)
		.outerRadius(radius -30);
	
	var text = d3.select("#donut")
				 .select(".labels")
				 //.data(my_data)
				 .selectAll("text")
				//	.data(pie(my_data), key);
					.data(pie(my_data),key)
					.enter()
	//text.enter()
		.append("text")
		.attr("font-size", ".85em")
		.text(function(d) {return d.data.geneName})
		//.attr("d",arc)
		.attr("transform", function(d) {
		var xoff = (1.1*radius*Math.sin(d.startAngle))-14;
		var yoff = -1.1*radius*Math.cos(d.startAngle);
		return "translate(" + xoff +"," + yoff + ")";
		});
	/*
		text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				//pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				pos[0] = (radius/2) * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});
	*/

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