const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/game.html')))

io.on('connection', function(socket){
  console.log('a user connected');
});
  
http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
