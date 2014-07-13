//sut2 - custom hacks
console.log('sut2 script loaded');
var myJson;
$(function() {
	
	/*
	$(document).keydown( function(e) {
		console.log(e.keyCode);
		//down 40
		//up 38
		//enter 13
	})
	*/
	
	console.log('sut2 onReady fired');
	
	$.getJSON("firstJson.json", function(json) {
	
		console.log(json);
		//console.log(myJson);
		myJson = json;
		var myResults = _.filter(myJson, function(s) { return (s.search('pat') > -1); } );
		console.log(myResults);
		
		}
	);
	
	$.getJSON("test2json.json", function(json) {
	
		console.log(json);
		//console.log(myJson);
		//myJson = json;
		//var myResults = _.filter(myJson, function(s) { return (s.search('pat') > -1); } );
		//console.log(myResults);
		
		}
	);
	
	
})
