const express = require('express');
const router = express.Router();
// const io = require('../../app');
// maybe change URL path to something like /swipe
// instead of /

const rooms = {};
// const io = req.app.get('socketio');

router.get('/', (req, res) => {
  res.send('WORKING');
});

module.exports = router;
