/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

const User = require('../../models/User');
const validateSignupInput = require('../../validation/signup');
const validateLoginInput = require('../../validation/login');

router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignupInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
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
          const payload = {
            id: user.id,
            email: user.email,
            saved: [],
          };

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
    if (!user) {
      errors.username = 'This user does not exist';
      return res.status(400).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username,
          saved: user.saved,
        };

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

// get a user
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const currUser = await User.findById(userId);
  if (currUser) {
    res.send(currUser);
  } else {
    res.status(400).send({ error: 'Could not find user' });
  }
});

// save a restaurant
router.post('/saved', async (req, res) => {
  const { userId, restaurant } = req.body;

  // for testing
  // const parsed = JSON.parse(restaurant);
  // console.log(parsed);
  // parsed['experience'] = '';
  // parsed['placeId'] = 1;
  // console.log(parsed);

  restaurant['experience'] = '';
  const currUser = await User.findById(userId);

  if (currUser && restaurant) {
    currUser.saved.push(restaurant);
    await currUser.save();
    res.send(JSON.stringify(restaurant));
  } else {
    res
      .status(400)
      .send({ error: 'Could not favorite this restaurant' });
  }
});

// edit experience emoji
router.put('/saved', async (req, res) => {
  const { userId, restaurant, exp } = req.body;
  const currUser = await User.findById(userId);

  if (restaurant && currUser && exp) {
    restaurant.experience = exp;
    console.log(restaurant.experience);
    currUser.save();
    // switch back to currUser
    res.send(restaurant);
  } else {
    res.status(400).send({ error: 'Invalid experience' });
  }
});

// delete a saved restaurant
router.delete('/saved', async (req, res) => {
  const { userId, restaurant } = req.body;
  const currUser = await User.findById(userId);

  if (currUser && restaurant) {
    const newSaved = currUser.saved.filter(
      (rest) => rest.placeId !== restaurant.placeId,
    );
    console.log(currUser.saved);
    currUser.saved = newSaved;
    console.log(currUser.saved);
    currUser.save();
    res.send(restaurant);
  } else {
    console.log(currUser, restaurant);
    res.status(400).send({ error: 'Unsuccessful deletion' });
  }
});

module.exports = router;
