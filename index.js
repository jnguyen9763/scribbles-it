const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http)
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/game.html')))

var players = [];
var gameRunning = false;
var word = "";

io.on('connection', function(socket) {
  console.log('a user connected');
  players.push(socket.id);

  if (players.length > 1 && !gameRunning) {
    gameRunning = true
    var id = players[Math.floor(Math.random() * Math.floor(players.length))]
    if (socket.id === id) {
      socket.emit('drawer');
    }
    else {
      socket.broadcast.to(id).emit('drawer')
    }
  }

  socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
  socket.on('word', (w) => word = w)

  socket.on('reset game', function() {
    io.emit('reset drawer');
    if (players.length > 1) {
      var id = players[Math.floor(Math.random() * Math.floor(players.length))]
      if (socket.id === id) {
        socket.emit('drawer');
      }
      else {
        socket.broadcast.to(id).emit('drawer')
      }
    }
    else {
      gameRunning = false
    }
  })

  socket.on('chat message', function(msg) {
    if (msg === word) {
      socket.emit('winner')
    }
    io.emit('chat message', msg)
  })

  socket.on('disconnect', function() {
    console.log('Client has disconnected');
    for (var i = 0; i < players.length; i++) {
      if (players[i] == socket.id) {
        players.splice(i, 1);
        break;
      }
    }

    if (players.length <= 1) {
      gameRunning = false;
      io.emit('reset drawer');
    }
  }) 
})

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
