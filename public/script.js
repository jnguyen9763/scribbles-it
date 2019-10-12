var socket = io();

function sendMessage(event) {
  event.preventDefault();
  var msg = document.querySelector('#text').value;
  document.querySelector('#text').value = '';
  if (/\S/.test(msg) && !isDrawer)
    socket.emit('chat message', msg);
}

const form = document.querySelector('form');
form.addEventListener('submit', sendMessage);

var brushColor = '#000';
var strokeWidth = 15;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;
var isDrawer = false;
var canvas = null;

var words = ["time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child", "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part", "place", "case", "week", "company", "system", "program", "question", "work", "government", "number", "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community", "name,", "president", "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force", "education"];

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');
  socket.on('mouse', newDrawing);
}

socket.on('chat message', function(msg) {
  $('#messages').prepend($('<li>').text(msg));
});

socket.on('drawer', function() {
  isDrawer = true;
  var word = words[Math.floor(Math.random() * Math.floor(words.length))];
  alert("You are the drawer! Your word is " + word + ".");
  socket.emit('word', word);
});

socket.on('reset drawer', function() {
  isDrawer = false;
  canvas.clear();
  canvas.background('#FFF');
});

socket.on('winner', function() {
  alert('You are the winner!');
  socket.emit('reset game');
});

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
