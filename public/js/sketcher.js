var mode;

var gui = function(p) 
{
  var buttons=[];
  var canvas;

  p.setup = function() {
    canvas = p.createCanvas(1048, 30);
    canvas.parent('nav');;

    buttons.push(new Button(5, 4, 60, 20, "Building", p.bBuilding));
    buttons.push(new Button(70, 4, 60, 20, "Road", p.bRoad));
    buttons.push(new Button(135, 4, 60, 20, "Park", p.bPark));
    buttons.push(new Button(200, 4, 60, 20, "Water", p.bWater));
    
    buttons.push(new Button(380, 4, 60, 20, "Undo", p.bUndo));
    buttons.push(new Button(445, 4, 60, 20, "Make!", p.bMake));
  }

  p.bRoad = function() {
    mode = 0;
  }

  p.bBuilding = function() {
    mode = 3;
  }

  p.bPark = function() {
    mode = 1;
  }

  p.bWater = function() {
    mode = 2;
  }

  p.bUndo = function() {
    clearLast();
  }

  p.bMake = function() {
    sendData();
  }

  p.draw = function() {
    p.background(255);
    for (var b=0; b<buttons.length; b++) {
      buttons[b].draw();
    }
  }

  p.mouseMoved = function() { 
    for (var b=0; b<buttons.length; b++) {
      buttons[b].mouseMoved(p.mouseX, p.mouseY);
    }
  }

  p.mousePressed = function() { 
    var buttonPressed = false;
    for (var b=0; b<buttons.length; b++) {
      if (buttons[b].mousePressed(p.mouseX, p.mouseY)) {
        buttonPressed = true;
      }
    }
  }

  p.mouseReleased = function() { 
    var buttonReleased = false;
    for (var b=0; b<buttons.length; b++) {
      if (buttons[b].mouseReleased(p.mouseX, p.mouseY)) {
        buttonReleased = true;
      }
    }
    if (!buttonReleased) {
      recording = false;
    }
  }

  function Button(x, y, w, h, txt, callback) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.txt = txt;
    this.callback = callback;
    this.highlighted = false;
    
    this.draw = function() {
      if (this.highlighted == true) {
        p.fill(0, 255, 0);
      } else {
        p.fill(255, 0, 0);
      }
      p.rect(this.x, this.y, this.w, this.h);
      p.fill(0);
      p.textSize(this.h - 4);
      p.text(this.txt, this.x + 2, this.y + this.h - 2);
    }

    this.mouseMoved = function(x, y) {
      if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h) {
        this.highlighted = true;
      } else {
        this.highlighted = false;
      }
    }
    this.mousePressed = function(x, y) {
      return this.highlighted;
    }

    this.mouseReleased = function(x, y) {
      if (this.highlighted) {
        this.callback();
      }
    }
  }
}


var sketcher = function (p) 
{
  var blobs;
  var currentBlob;
  var recording;
  var mouseVelocity;
  var canvas;

  p.setup = function() {
    canvas = p.createCanvas(512, 512);
    canvas.parent('draw');

    blobs = [];
    recording = false;  
    mouseVelocity = 0.0;
    mode = 1;
  }

  p.draw = function() {
    p.background(255);
    for (var b=0; b<blobs.length; b++) {
      blobs[b].draw();
    }
    if (recording && mouseVelocity < 0.01) {
      currentBlob.mouseMoved(p.mouseX, p.mouseY);
    }    
    var d = p.dist(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY); 
    mouseVelocity = p.lerp(mouseVelocity, d, 0.1);
  }

  p.mouseMoved = function() { 
    
  }

  p.mousePressed = function() { 
    recording = true;
    if (mode == 0) {
      p.createNew(new Blob(false, p.color(0,0,0), 4, 12));
    } else if (mode == 1) {
      p.createNew(new Blob(true, p.color(0,255,0), 0, 12));
    } else if (mode == 2) {
      p.createNew(new Blob(true, p.color(0,0,255), 0, 20));
    } else if (mode == 3) {
      p.createNew(new Blob(true, p.color(255,0,0), 0, 12));
    }
  }

  p.mouseReleased = function() { 
    recording = false;
  }

  p.mouseDragged = function() {
    if (recording) {
      currentBlob.mouseMoved(p.mouseX, p.mouseY);
    }
  }

  p.createNew = function(blob) {
    currentBlob = blob;
    blob.add(p.mouseX, p.mouseY);
    blobs.push(blob);
  }

  p.clearLast = function() {
    blobs.slice(blobs.length-1, 1);
  }
  
  function Blob(filled, clr, thickness, frameSkip) {
    this.p = p;
    this.points = [];
    this.thickness = thickness;
    this.filled = filled;
    this.clr = clr;
    this.frameSkip = frameSkip;

    this.setStyle = function(filled, clr, frameSkip) {
      this.filled = filled;
      this.clr = clr;
      this.frameSkip = frameSkip;
    }
      
    this.add = function(x, y) {
      this.points.push({x:x, y:y});
    }
    
    this.draw = function() {
      this.p.push();
      if (this.filled) {
        this.p.fill(this.clr);
        this.p.noStroke();
      } else {
        this.p.noFill();
        this.p.stroke(this.clr);
        this.p.strokeWeight(this.thickness);
      }    
      this.p.beginShape();
      for (var p=0; p<this.points.length; p++) {
        this.p.curveVertex(this.points[p].x, this.points[p].y);
      }
      this.p.endShape();  
      this.p.pop();
    }

    this.mouseMoved = function(x, y) {
      if (p.frameCount % 2 == 0) {
        this.add(x, y);
      }
    }
  }

  p.uploadSketch = function() {
    var img = canvas.elt.toDataURL("image/png");
    $.ajax({
      type: "POST",
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      url: "/sketch-me",
      data: JSON.stringify({img: img}),
      success: function(result) {}
    });
  }
}


var sketcher = new p5(sketcher);
var gui = new p5(gui);
