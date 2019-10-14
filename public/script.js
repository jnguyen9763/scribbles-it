var socket = io();
var username = null;
var brushColor = '#353839';
var strokeWidth = 20;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;
var isDrawer = false;
var canvas = null;
var words = ["time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child", "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part", "place", "case", "week", "company", "system", "program", "question", "work", "government", "number", "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community", "name,", "president", "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force", "education"];
var buttonSound = new Audio();
var messageSound = new Audio();
buttonSound.src = 'images/button.mp3';
messageSound.src = 'images/message.mp3';

window.onload = function() {
  while(username === null) username = prompt("Enter your username");
  socket.emit('new player', username);
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');
  socket.on('mouse', newDrawing);
}

socket.on('chat message', function(username, msg) {
  message(username, msg);
  messageSound.play();
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

function message(username, msg) {
  var placeholder = document.getElementById('chat-placeholder');
  if (document.body.contains(placeholder)) {
    placeholder.style.display = "none";
  }
  $('#messages').append($('<li>').append($('<span class="bold">').text(username)).append($('<span>').text(": " + msg)));
  document.getElementById('messages').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg) && !isDrawer) {
    socket.emit('chat message', username, msg);
    message("You", msg);
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
    console.log('test');
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
