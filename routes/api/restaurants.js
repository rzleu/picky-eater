const express = require('express');
const router = express.Router();
const passport = require('passport');
const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');
const validateRestaurantInput = require('../../validation/restaurant');

router.get('/', (req, res) => {
  Restaurant.find()
    .then((restaurants) => res.json(restaurants))
    .catch((err) =>
      res
        .status(404)
        .json({ norestaurantsfound: 'No saved restaurants' }),
    );
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const favoritedRestaurant = {
      name: req.body.name,
      address: req.body.address,
      category: req.body.category,
      photo: req.body.photo,
    };

    // include user's id along with request?
    User.findOneAndUpdate(
      {
        id: req.body.userId,
      },
      { $push: { saved: favoritedRestaurant } },
      { new: true },
    )
      .then(() => res.json({ restaurant: favoritedRestaurant }))
      .catch((err) =>
        res.status(404).json({ msg: 'No restaurant found' }),
      );
  },
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const currUser = User.findById(req.body.userId);
    Restaurant.findById(req.body.id)
      .then((restaurant) => {
        const newArr = currUser.filter(
          (stores) => stores !== restaurant,
        );
        currUser.saved = newArr;
      })
      .then(() => res.json({ newArr: currUser.saved }))
      .catch((err) =>
        res
          .status(404)
          .json({ msg: 'Could not remove saved restaurant' }),
      );
  },
);

module.exports = router;
