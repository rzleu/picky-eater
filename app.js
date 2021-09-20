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
app.set('socketio', io);

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
app.use('/api/lobbies', lobbies);
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server is running on port ${port}`),
);

server.listen(3001, () => {
  console.log('Server is running on 3001');
});

// let approvedList = [];
// const users = {
//   1: {
//     id: 1,
//     list: [],
//   },
//   2: {
//     id: 2,
//     list: [],
//   },
// };
// socket.on('right-swipe', ({ selection, id }) => {
//   users[id] = {
//     ...users[id],
//     list: users[id].list.concat(selection),
//   };
//   if (id === 1) {
//     approvedList = users[2].list;
//   } else {
//     approvedList = users[1].list;
//   }
//   io.sockets.emit('approved-list', approvedList);
// });
