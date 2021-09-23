const express = require('express');

const router = express.Router();

const Restaurant = require('../../models/Restaurant');
const User = require('../../models/User');

router.get('/test', (req, res) =>
  res.json({ msg: 'This is the restaurants route' }),
);

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
    { $push: { favorites: favoritedRestaurant } },
  )
    .then(() => res.json({ restaurant: favoritedRestaurant }))
    .catch((err) => console.log(err));
});

module.exports = router;
