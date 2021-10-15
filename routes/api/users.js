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
      username: req.user.username,
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

  restaurant['experience'] = '';
  const currUser = await User.findById(userId);
  if (
    currUser &&
    currUser.saved.some((el) => el.place_id === restaurant.place_id)
  ) {
    res
      .send('restaurant has already been added to saved')
      .status(400);
    return;
  }

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
  const { userId, id, exp } = req.body;
  const currUserSaved = await User.findById(userId);
  if (currUserSaved) {
    const currSaved = currUserSaved.saved;
    const i = currSaved.findIndex((rest) => rest.place_id === id);
    if (i === -1) {
      res.send('cannot find saved restaurant').status(404);
      return;
    }
    currSaved[i].experience = exp;
    const currUser = await User.findByIdAndUpdate(
      userId,
      {
        saved: currSaved,
      },
      { new: true },
    );
    res.send(currUser.saved);
  } else {
    res.status(400).send({ error: 'Invalid' });
  }
});

// delete a saved restaurant
router.delete('/saved', async (req, res) => {
  const { userId, restaurant } = req.body;
  const currUserSaved = await User.findById(userId);
  // const currSaved = currUserSaved.saved;
  if (currUserSaved) {
    const newSaved = currUserSaved.saved.filter(
      (rest) => rest.place_id !== restaurant,
    );

    const currUser = await User.findByIdAndUpdate(
      userId,
      {
        saved: newSaved,
      },
      { new: true },
    );

    res.send(currUser);
  } else {
    res.status(400).send({ error: 'Unsuccessful deletion' });
  }
});

module.exports = router;
