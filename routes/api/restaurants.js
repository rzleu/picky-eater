const express = require('express');
const router = express.Router();

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

router.post('/', (req, res) => {
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
  )
    .then(() => res.json({ restaurant: favoritedRestaurant }))
    .catch((err) => console.log(err));
});

router.delete('/', (req, res) => {
  Restaurant.findById(req.body.id).then();
});

module.exports = router;
