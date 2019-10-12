var socket = io();

var brushColor = '#000';
var strokeWidth = 15;
var canvasWidth = document.getElementById('canvas').clientWidth;
var canvasHeight = document.getElementById('canvas').clientHeight;

var words = ["time", "year", "people", "way", "day", "man", "thing", "woman", "life", "child", "world", "school", "state", "family", "student", "group", "country", "problem", "hand", "part", "place", "case", "week", "company", "system", "program", "question", "work", "government", "number", "night", "point", "home", "water", "room", "mother", "area", "money", "story", "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community", "name,", "president", "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force", "education"];

function setup() {
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas');
  background('#FFF');

  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  stroke(data.color);
  strokeWeight(data.strokeWidth);
  line(data.x, data.y, data.px, data.py);
}

function mouseDragged() {
  // console.log(words[Math.floor(Math.random() * Math.floor(words.length))]);
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
