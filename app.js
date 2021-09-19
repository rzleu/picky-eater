const express = require('express');

const app = express();
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

app.listen(port, () =>
  console.log(`Server is running on port ${port}`),
);
