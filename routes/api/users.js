/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const User = require('../../models/User');
const List = require('../../models/List');
const validateSignupInput = require('../../validation/signup');
const validateLoginInput = require('../../validation/login');

// create user profile
router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignupInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    // add addtional username check?
    if (user) {
      errors.email = 'User already exists';
      return res.status(400).json(errors);
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      saved: [],
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          const payload = { id: user.id, email: user.email };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (_, token) => {
              res.json({
                payload,
                success: true,
                token: `Bearer ${token}`,
                payload,
              });
            },
          );
        });
        // .catch((err) => console.log(err));
      });
    });
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    // console.log(user);
    if (!user) {
      errors.username = 'This user does not exist';
      return res.status(400).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user.id, username: user.username };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              payload,
              success: true,
              token: `Bearer ${token}`,
            });
          },
        );
      } else {
        errors.password = 'Incorrect password';
        return res.status(400).json(errors);
      }
    });
  });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      handle: req.user.handle,
      email: req.user.email,
      saved: req.user.saved,
    });
  },
);
// anthony.saved = { // "this is an object" -anthony Oct 2021
//   _id: "3e234234"
//   'my hoes': [obj1, obj2], // list
//   'my bros': [obj3, obj4],
// };

// create individual list
router.post('/lists', (req, res) => {
  const { title, id } = req.body;
  console.log(req.body);
  // throw error if title exists as a key in saved hash
  // const currUser = await User.findById(id);a
  const currUser = User.findById(id);
  console.log(currUser.schema);
  if (!Object.keys(currUser.saved).includes(title)) {
    const newList = new List({ title: title, restaurants: [] });
    currUser.saved[title] = newList;
    currUser.save();
  } else {
    res.send('create individual list'); // cindy's task
  }
});

// add preference to existing list// api/users/:user_id
router.post('/saved', (req, res) => {
  const { title, id, obj } = req.body;
  const currUser = User.findById(id);
  const list = currUser.saved[title];
  if (list && !list.includes(obj)) {
    list.push(obj);
    currUser.save();
  } else {
    res.send('add preference to existing list'); // cindy, fix error
  }
});

// read preference/ profile

// delete specific preference
router.delete('/saved', (req, res) => {
  const { title, id, obj } = req.body;
  const currUser = User.findById(id);
  const list = currUser.saved[title];
  if (list && list.includes(obj)) {
    currUser.saved[title] = list.filter((ele) => ele !== obj);
    currUser.save();
  } else {
    res.send('delete specific preference'); // cindy, fix error
  }
});

//delete whole list
router.post('/lists', (req, res) => {
  const { title, id } = req.body;
  // throw error if title exists as a key in saved hash
  const currUser = User.findById(id);
  if (currUser.saved.title) {
    delete currUser.saved.title;
    currUser.save();
  } else {
    res.send('delete whole list'); // cindy's task
  }
});

module.exports = router;
