const express = require('express');
const router = express.Router();

// maybe change URL path to something like /swipe
// instead of /
const swipeLobby = {};
router.post('/', (req, res) => {
  const io = req.app.get('socketio');
  if (!swipeLobby[req.body.room]) {
    swipeLobby[req.body.room] = { users: {} };
    io.emit('room-created', req.body.room);
  }
  // destructure req.body HERE
  // io.on('connection', (socket) => {
  //   // joining a room that is empty/full

  //   socket.on('join-room', (room) => {
  //     let clients;
  //     if (numClients === 0) {
  //       clients = io.sockets.clients(room);
  //       socket.join(room);
  //       socket.emit();
  //     } else if (numClients === 1) {
  //       clients = io.sockets.clients(room);
  //       io.sockets.in(room).emit('join', { ...clients });
  //       socket.join(room);
  //       socket.emit('joined', room);
  //     } else {
  //       socket.emit('full-room', room);
  //     }
  //   });
  // });

  io.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
});

module.exports = router;
