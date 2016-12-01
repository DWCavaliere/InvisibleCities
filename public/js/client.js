var host = window.location.origin;

function start() {
	var socket = io.connect(host);

	// receive errors from debug-console.js via server.js
	socket.on('err', function(data) {
		//logError(data);
		console.log("error: "+data)
	});

	socket.on('getData', function (data) {
		console.log("got some data")
		console.log(data.data);
		console.log(data.image);
	});

	socket.on('newImageGenerated', function (data) {
		console.log("got new image")
//		console.log(data.data);
//		$('#result').html('<img src="render.jpg"/>');
		d = new Date();
		$("#results_image").attr("src", "render.jpg?"+d.getTime());
	});
};

function requestData() {
	var socket = io.connect(host);
	socket.emit('requestData');
}

function sendData() {
	var socket = io.connect(host);
	var canvas = document.getElementById("defaultCanvas0");
	var img = canvas.toDataURL("image/png");
	socket.emit('sendData', {myData:"data to server", image:img});
}

window.onload = function() {
	start();
};

