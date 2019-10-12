var socket = io();

function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg))
    socket.emit('chat message', msg);
}

const form = document.querySelector('form');
form.addEventListener('submit', sendMessage);

var brushColor = '#000';
var strokeWidth = 15;

function setup() {
  var canvasWidth = document.getElementById('canvas').clientWidth;
  var canvasHeight = document.getElementById('canvas').clientHeight;
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');

  socket.on('mouse', newDrawing);
}

socket.on('chat message', function(msg){
  $('#messages').prepend($('<li>').text(msg));
});

function newDrawing(data) {
  stroke(data.color);
  strokeWeight(data.strokeWidth);
  line(data.x, data.y, data.px, data.py);
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
    color: brushColor,
    strokeWidth: strokeWidth
  }
  socket.emit('mouse', data);
}
