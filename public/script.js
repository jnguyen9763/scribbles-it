var socket = io();

var brushColor = '#000';
var strokeWidth = 15;

function setup() {
  var canvasWidth = document.getElementById('canvas').clientWidth;
  var canvasHeight = document.getElementById('canvas').clientHeight;
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');

  socket.on('mouse', data => {
    stroke(data.color);
    strokeWeight(data.strokeWidth);
    line(data.x, data.y, data.px, data.py);
  })

}

function draw() {
}

function mouseDragged() {
  stroke(brushColor);
  strokeWeight(strokeWidth);
  line(mouseX, mouseY, pmouseX, pmouseY);
  sendMouse(mouseX, mouseY, pmouseX, pmouseY);
}

function sendMouse(x, y, pX, pY) {
  const data = {
    x: x,
    y: y,
    px: pX,
    py: pY,
    color: color,
    strokeWidth: strokeWidth
  }
  socket.emit('mouse', data);
}
