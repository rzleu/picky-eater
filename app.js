const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');

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

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(passport.initialize());

require('./config/passport')(passport);
app.use('/api/users', users);

const randomCodeGenerator = () => {
  let string = '';

  for (let i = 0; i < 4; i++) {
    string += Math.floor(Math.random() * 9);
  }

  return string;
};

io.on('connection', (socket) => {
  socket.on('FOUND_MATCH', (match) => {
    const roomId = io.sockets.sockets.get(socket.id).roomId;
    io.in(roomId).emit('MATCH', { message: 'found match!', match });
  });

  socket.on('CREATE_RAND_ROOM', (restaurants) => {
    console.log({ restaurants });
    let roomCode = randomCodeGenerator();
    while (socket.adapter.rooms.has(roomCode)) {
      roomCode = randomCodeGenerator();
    }
    socket.leave(socket.id);
    socket.join(roomCode); // user will join room with rand 4-digit code

    io.sockets.sockets.get(socket.id).list = restaurants; // host's restaurants
    io.sockets.sockets.get(socket.id).roomId = roomCode;

    io.sockets.sockets.get(socket.id).approvedList = [];
    socket.emit('ROOM_CODE', roomCode); // return code to FE
    socket.to(roomCode).emit('MASTER_LIST', restaurants);
  });

  socket.on('JOIN_ROOM', (room) => {
    socket.leave(socket.id);
    const rooms = socket.adapter.rooms;

    if (rooms.has(room) && rooms.get(room).size < 2) {
      socket.join(room);

      let otherUser;
      rooms.get(room).forEach((socketId) => {
        if (socketId !== socket.id) {
          otherUser = socketId;
        }
      });

      const data = io.sockets.sockets.get(otherUser).list;
      io.sockets.sockets.get(socket.id).roomId = room;
      socket.to(room).emit('JOIN_REQUEST_ACCEPTED', room);
      socket.to(room).emit('MASTER_LIST', data);
    } else {
      const message = 'Invalid PIN';
      socket.emit('INVALID_PIN', message);
    }
  });

  socket.on('RIGHT_SWIPE_LIST', (approvedList) => {
    const room = io.sockets.sockets.get(socket.id).roomId;

    socket
      .to(room)
      .emit('RECEIVE_OTHER_LIST', { approvedList, user: socket.id });
  });

  socket.on('disconnect', () => {
    io.emit('disconnect-message', 'A user has left the chat');
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () =>
  console.log(`Server is running on port ${port}`),
);
