const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http)
const uuid = require('uuid/v4')
const PORT = process.env.PORT || 5000

var rooms = [];

var players = [];
var gameRunning = false;
var word = "";

var painters = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname + '/public/'}))
app.get('/game', (req, res) => res.sendFile('game.html', {root: __dirname + '/public/'}))
app.get('/paint', (req, res) => res.sendFile('paint.html', {root: __dirname + '/public/'}))
/*
app.get('/game', (req, res) => res.redirect('/game/' + uuid()));
app.get('/paint', (req, res) => res.send('/paint/' + uuid()));
app.get('/game/:id', function(req, res) {
  res.sendFile('game.html', {root: __dirname + '/public/'})
  var room = new Object();
  room.uuid = res.params.id;
  room.players = [];
  room.gameRunning = false;
  room.word = "";
  rooms.push(room);
  console.log(room.uuid);
})
app.get('/paint/:id', (req, res) => res.sendFile('paint.html', {root: __dirname + '/public/'}));
*/

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('new painter', function(username) {
    var painter = new Object()
    painter.socket = socket.id
    painter.user = username;
    painter.clear = null
    painters.push(painter);
  })

  socket.on('new player', function(username) {
    var player = new Object()
    player.socket = socket.id
    player.user = username;
    player.points = 0
    players.push(player)

    if (players.length > 1 && !gameRunning) {
      gameRunning = true
      var id = players[Math.floor(Math.random() * Math.floor(players.length))].socket
      if (socket.id === id) {
        socket.emit('drawer');
      }
      else {
        socket.broadcast.to(id).emit('drawer')
      }
    }
  })

  socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
  socket.on('word', (w) => word = w)
  socket.on('clear', () => io.emit('clear'))

  socket.on('clear request', function() {
    for (var i = 0; i < painters.length; i++) {
      if (painters[i].socket !== socket.id) {
        painters[i].clear = null;
        socket.broadcast.to(painters[i].socket).emit('clear request')
      }
      else if (painters.length === 1) {
        socket.emit('clear')
      }
      else {
        painters[i].clear = true
      }
    }
  })

  socket.on('clear response', function(response) {
      var ready = true;
      for (var i = 0; i < painters.length; i++) {
        if (painters[i].socket === socket.id) {
          painters[i].clear = response
        }
        if (painters[i].clear === false || painters[i].clear === null) {
          ready = false
        }
      }

      if (ready) io.emit('clear')

  })

  socket.on('reset game', function() {
    io.emit('reset drawer');
    io.emit('clear');
    if (players.length > 1) {
      var id = players[Math.floor(Math.random() * Math.floor(players.length))].socket
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

  socket.on('chat message', function(username, color, msg) {
    if (msg === word) {
      for (var i = 0; i < players.length; i++) {
        if (players[i].socket === socket.id) {
          players[i].points += 5;
          socket.emit('winner', players[i].points);
          break;
        }
      }
    }
    socket.broadcast.emit('chat message', username, color, msg)
  })

  socket.on('disconnect', function() {
    console.log('Client has disconnected');
    for (var i = 0; i < painters.length; i++) {
      if (painters[i].socket == socket.id) {
        painters.splice(i, 1);
        break;
      }
    }

    for (var i = 0; i < players.length; i++) {
      if (players[i].socket == socket.id) {
        players.splice(i, 1);
        break;
      }
    }

    if (players.length <= 1) {
      gameRunning = false;
      io.emit('reset drawer');
      io.emit('clear');
    }
  })
})

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
