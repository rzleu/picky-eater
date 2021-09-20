const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const lobbies = require('./routes/api/lobbies');

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'frontend', 'build', 'index.html'),
    );
  });
}

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(passport.initialize());

require('./config/passport')(passport);
app.use('/api/users', users);
// app.use('/api/lobbies', lobbies);
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server is running on port ${port}`),
);

server.listen(3001, () => {
  console.log('Server is running on 3001');
});

const rooms = {};
app.post('/api/lobbies', (req, res) => {
  if (!rooms[req.body.room]) {
    const room = req.body.room;
    rooms[room] = { users: {} };
    io.emit('room-created', req.body.room);
    res.json({ room: rooms });
  }
});

io.on('connection', (socket) => {
  // joining a room that is empty/full

  socket.on('join-room', (room, username) => {
    if (Object.values(rooms[room]).length < 2) {
      socket.join(room);
      rooms[room].users[socket.id] = username;
      res.send('Socket on ending');
      // rooms = { room: { users: { 1: anthill499, 2: cindyjiang } } }
    } else {
      socket.emit('full-room', {
        message: 'Room is unavailable',
        room,
      });
    }
  });

  socket.on('disconnect', (room) => {
    delete rooms[room].users[socket.id];
    io.emit('disconnect-message', 'A user has left the chat');
  });
});
