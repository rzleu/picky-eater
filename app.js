const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');

mongoose.connect(db, { useNewUrlParser: true });
// .then(() => console.log('Connected to MongoDB successfully'))
// .catch((err) => console.log(err));

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

const port = process.env.PORT || 5000;

app.listen(port);
//  () =>
//   console.log(`Server is running on port ${port}`),

server.listen(3001);
// , () => {
//   console.log('Server is running on 3001');
// });

const randomCodeGenerator = () => {
  let string = '';

  for (let i = 0; i < 4; i++) {
    string += Math.floor(Math.random() * 9);
  }

  return string;
};

io.on('connection', (socket) => {
  socket.on('USER_ONLINE', ({ username, id }) => {
    socket.user = { username, id };
  });

  socket.on('CREATE_RAND_ROOM', (restaurants) => {
    let roomCode = randomCodeGenerator();

    while (socket.adapter.rooms.has(roomCode)) {
      roomCode = randomCodeGenerator();
    }
    // console.log({ restaurants });

    socket.leave(socket.id);
    socket.join(roomCode); // user will join room with rand 4-digit code
    io.sockets.sockets.get(socket.id).list = restaurants;
    socket.emit('ROOM_CODE', roomCode); // return code to FE
    socket.to(roomCode).emit('MASTER_LIST', restaurants);
  });

  socket.on('JOIN_ROOM', (room) => {
    socket.leave(socket.id);

    const rooms = socket.adapter.rooms;

    if (
      // !rooms.has(room) ||
      rooms.has(room) &&
      rooms.get(room).size < 2
    ) {
      socket.join(room);
      const data = io.sockets.sockets.get(room).list;
      socket.to(room).emit('JOIN_REQUEST_ACCEPTED');
      socket.to(room).emit('MASTER_LIST', data);
    } else {
      // console.log('room full');
      socket.emit('full-room', {
        message: 'Room is unavailable',
        room,
      });
    }
  });

  // socket.on('MASTER_LIST', (resData, room) => {
  //   // get room code from FE
  //   const rooms = socket.adapter.rooms;

  //   rooms.get(room).forEach((socketId) => {
  //     io.sockets.sockets.get(socketId).list = resData;
  //     // console.log(io.sockets.sockets.get(socketId));
  //   });
  // });

  socket.on('disconnect', () => {
    io.emit('disconnect-message', 'A user has left the chat');
  });
});
