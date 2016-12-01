var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;


var drawPath = "pix2pix/datasets/app/val/render.jpg";
var renderPath = "pix2pix/results/venice/latest_net_G_val/images/output/render.jpg";

    
io.on('connection', function (socket) {
  console.log("Socket initialized");

  socket.on('requestData', function () {
    socket.emit('getData', {data:""});
  });   
 
  socket.on('sendData', function (data) { 
    var timestamp = new Date().getTime();
    var cmd_generate = "DATA_ROOT=pix2pix/datasets/app/ checkpoints_dir=pix2pix/checkpoints results_dir=pix2pix/results/ name=venice which_direction=AtoB phase=val th pix2pix/test.lua"; 
    var cmd_copyDrawing = "cp "+drawPath+" "+__dirname+"/public/gallery/drawing/d"+timestamp+".jpg";
    var cmd_copyRender  = "cp "+renderPath+" "+__dirname+"/public/gallery/render/r"+timestamp+".jpg";
    var imgFile = data.image.replace(/^data:image\/png;base64,/, "");
    
    fs.writeFile(drawPath, imgFile, 'base64', function(err) {
      exec(cmd_generate, function (error, stdout, stderr) {
        console.log("generated image");
        exec(cmd_copyDrawing, function (error, stdout, stderr) {
          exec(cmd_copyRender, function (error, stdout, stderr) {
            console.log("copied images to public")
            socket.emit('newImageGenerated', {timestamp:timestamp}); 
          });
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
  console.log('app listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

