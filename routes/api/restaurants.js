const express = require('express');

const router = express.Router();

const Restaurant = require('../../models/Restaurant');

router.get('/test', (req, res) =>
  res.json({ msg: 'This is the restaurants route' }),
);

module.exports = router;
