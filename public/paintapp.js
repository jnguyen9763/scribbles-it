var colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#55acee', '#353839'];
var socket = io();
var username = null;
var myColor = colors[Math.floor(Math.random() * Math.floor(colors.length))];
var brushColor = '#353839';
var strokeWidth = 20;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;
var canvas = null;
var buttonSound = new Audio();
var messageSound = new Audio();
buttonSound.src = 'images/button.mp3';
messageSound.src = 'images/message.mp3';

window.onload = function() {
  while(username === null) username = prompt("Enter your username");
  socket.emit('new painter', username);
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');
  socket.on('mouse', newDrawing);
}

socket.on('chat message', function(username, color, msg) {
  message(username, color, msg);
  messageSound.play();
});

socket.on('clear request', function() {
  var response = confirm("Ready to clear?");
  socket.emit('clear response', response);
});

socket.on('clear',function() {
  canvas.clear();
  canvas.background('#FFF');
});

function message(username, color, msg) {
  var placeholder = document.getElementById('chat-placeholder');
  if (document.body.contains(placeholder)) {
    placeholder.style.display = "none";
  }
  $('#messages').append($('<li>').append($('<span>').css('font-weight', 'bold').css('color', color).text(username + ": ")).append($('<span>').text(msg)));
  document.getElementById('messages').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg)) {
    socket.emit('chat message', username, myColor, msg);
    message("You", myColor, msg);
  }
}

function changeColor(event) {
  var source = event.target;

  if (source.id !== "color") {
    document.getElementById("red").classList.remove("pressed");
    document.getElementById("orange").classList.remove("pressed");
    document.getElementById("yellow").classList.remove("pressed");
    document.getElementById("green").classList.remove("pressed");
    document.getElementById("blue").classList.remove("pressed");
    document.getElementById("black").classList.remove("pressed");
    document.getElementById("erase-button").classList.remove("pressed");

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

    source.classList.add("pressed");
  }
}

function changeBrush(event) {
  var source = event.target;

  if (source.id !== "brush") {
    document.getElementById("small").classList.remove("pressed");
    document.getElementById("medium").classList.remove("pressed");
    document.getElementById("big").classList.remove("pressed");

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

    source.classList.add("pressed");
  }
}

function onErase() {
  document.getElementById("red").classList.remove("pressed");
  document.getElementById("orange").classList.remove("pressed");
  document.getElementById("yellow").classList.remove("pressed");
  document.getElementById("green").classList.remove("pressed");
  document.getElementById("blue").classList.remove("pressed");
  document.getElementById("black").classList.remove("pressed");
  document.getElementById("erase-button").classList.add("pressed");
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
