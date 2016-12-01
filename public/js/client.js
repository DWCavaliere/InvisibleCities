var host = window.location.origin;

function start() {
	var socket = io.connect(host);

	// receive errors from debug-console.js via server.js
	socket.on('err', function(err) {
		//logError(data);
	});

	socket.on('getData', function (data) {
		//
	});

	socket.on('newImageGenerated', function (data) {
		console.log("got image "+data.timestamp);
		$("#results_image").attr("src", "gallery/render/r"+data.timestamp+".jpg");
	});
};

function requestData() {
	var socket = io.connect(host);
	socket.emit('requestData');
};

function sendData() {
	var socket = io.connect(host);
	var canvas = document.getElementById("defaultCanvas0");
	var canvas_2 = document.createElement('canvas');
	var ctx = canvas_2.getContext('2d');
	canvas_2.width = canvas.width * 2;
	canvas_2.height = canvas.height;
	ctx.drawImage(canvas, 0, 0);
	var img = canvas_2.toDataURL("image/png");
	socket.emit('sendData', {data:"data", image:img});
};

function activateTouchEvents() {
	var canvas0 = document.getElementById("defaultCanvas0");
	var canvas1 = document.getElementById("defaultCanvas1");
	canvas0.ontouchstart = function(e) {
	  if (e.touches) e = e.touches[0];
	  return false;
	};
	canvas1.ontouchstart = function(e) {
	  if (e.touches) e = e.touches[0];
	  return false;
	};
};

window.onload = function() {
	start();
	activateTouchEvents();
};

