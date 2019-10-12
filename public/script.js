var socket = io();

function setup() {
  createCanvas(1000, 580);
  background(200);
  line(0, 0, width, height);
}

function draw() {
  if (mouseIsPressed) {
     fill(0);
  } else {
     fill(255);
  }

  ellipse(mouseX, mouseY, 20, 20);
}
