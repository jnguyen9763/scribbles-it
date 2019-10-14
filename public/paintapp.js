var socket = io();

var brushColor = '#353839';
var strokeWidth = 20;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;
var canvas = null;
var buttonSound = new Audio();
buttonSound.src = 'images/button.mp3';

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');
  socket.emit('new painter');
  socket.on('mouse', newDrawing);
}

socket.on('chat message', function(msg) {
  $('#messages').prepend($('<li>').text(msg));
});

socket.on('clear request', function() {
  console.log('test');
  var response = confirm("Ready to clear?");
  socket.emit('clear response', response);
});

socket.on('clear',function() {
  canvas.clear();
  canvas.background('#FFF');
});

function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg))
    socket.emit('chat message', msg);
}

function changeColor(event) {
  var source = event.target;
  switch (source.id) {
    case "red":
      brushColor = '#e74c3c';
      break;
    case "orange":
      brushColor = '#e67e22';
      break;
    case "yellow":
      brushColor = '#f1c40f';
      break;
    case "green":
      brushColor = '#2ecc71';
      break;
    case "blue":
      brushColor = '#55acee';
      break;
    case "black":
      brushColor = '#353839';
      break;
    default:
      brushColor = '#353839';
      break;
  }
}

function changeBrush(event) {
  var source = event.target;
  switch (source.id) {
    case "small":
      strokeWidth = 20;
      break;
    case "medium":
      strokeWidth = 30;
      break;
    case "big":
      strokeWidth = 40;
      break;
    default:
      strokeWidth = 20;
      break;
  }
}

function onErase() {
  brushColor = "#FFF";
}

function onClear() {
  socket.emit('clear request');
}

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

function sendMouse(x, y, pX, pY, width, height) {
  const data = {
    x: x,
    y: y,
    px: pX,
    py: pY,
    width: width,
    height: height,
    color: brushColor,
    strokeWidth: strokeWidth
  }
  socket.emit('mouse', data);
}

const form = document.querySelector('form');
form.addEventListener('submit', sendMessage);
const colorButton = document.querySelector('#color');
colorButton.addEventListener('click', changeColor);
const brushButton = document.querySelector('#brush');
brushButton.addEventListener('click', changeBrush);
const eraseButton = document.querySelector('#erase-button');
eraseButton.addEventListener('click', onErase);
const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click', onClear);
