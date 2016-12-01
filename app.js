var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');


var sys = require('sys')
var exec = require('child_process').exec;


io.on('connection', function (socket) {
	console.log("Initialize Socket");

	// this is a request
  socket.on('requestData', function () {
    var img = null;
    socket.emit('getData', {data:"hello world", image:img});
  });    
 
  socket.on('sendData', function (data) { 
    console.log('received data = '+data.myData);
    
    var savePath = "/home/gene/projects/pix2pix/datasets/app/val/render.jpg";
    var outPath = "/home/gene/projects/pix2pix/results/venice/latest_net_G_val/images/output/render.jpg";
    var cmd1 = "DATA_ROOT=/home/gene/projects/pix2pix/datasets/app/ checkpoints_dir=/home/gene/projects/pix2pix/checkpoints results_dir=/home/gene/projects/pix2pix/results/ name=venice which_direction=AtoB phase=val th /home/gene/projects/pix2pix/test2.lua"; 
	var cmd2 = "cp "+outPath+" "+__dirname+"/public/render.jpg";

    var imgFile = data.image.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(savePath, imgFile, 'base64', function(err) {
      exec(cmd1, function (error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
        console.log("IT WORKED!!"); 

		exec(cmd2, function (error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
	        console.log("COPIED!"); 
			socket.emit('newImageGenerated', {data:"done"}); 
	     });

		
      });
    });
  });    
 
  // error handling
  socket.on('err', function (data) {
		socket.broadcast.emit('err', data); // send back to client
  });
});

app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT || 5000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
