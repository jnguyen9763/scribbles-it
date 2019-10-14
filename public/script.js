var socket = io();

var brushColor = '#353839';
var strokeWidth = 20;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;
var isDrawer = false;
var canvas = null;
var words = ["time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child", "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part", "place", "case", "week", "company", "system", "program", "question", "work", "government", "number", "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community", "name,", "president", "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force", "education"];
var buttonSound = new Audio();
buttonSound.src = 'images/button1.mp3';

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');
  socket.on('mouse', newDrawing);
  socket.emit('new player');
}

socket.on('chat message', function(msg) {
  $('#messages').prepend($('<li>').text(msg));
});

socket.on('drawer', function() {
  isDrawer = true;
  var word = words[Math.floor(Math.random() * Math.floor(words.length))];
  drawerBox.innerHTML = "You are the drawer! Your word is <b>" + word + "</b>.";
  socket.emit('word', word);
});

socket.on('reset drawer', function() {
  isDrawer = false;
  drawerBox.innerHTML = "You are the guesser! Guess the drawing.";
});

socket.on('clear',function() {
  canvas.clear();
  canvas.background('#FFF');
});

socket.on('winner', function(points) {
  score.innerHTML = "Score: " + points;
  socket.emit('reset game');
});


function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg) && !isDrawer)
    socket.emit('chat message', msg);
}

function changeColor(event) {
  var source  = event.target;
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
  if (isDrawer) {
    canvas.clear();
    canvas.background('#FFF');
    socket.emit('clear');
  }
}

function newDrawing(data) {
  stroke(data.color);
  strokeWeight(data.strokeWidth);
  line(data.x, data.y, data.px, data.py);
}

function mouseDragged() {
  if (isDrawer) {
    stroke(brushColor);
    strokeWeight(strokeWidth);
    line(mouseX, mouseY, pmouseX, pmouseY);
    sendMouse(mouseX, mouseY, pmouseX, pmouseY);
  }
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
const drawerBox = document.querySelector('#drawer-box');
const score = document.querySelector('#score');
