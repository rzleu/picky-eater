const mongoose = require('mongoose');

const { Schema } = mongoose;

const ListSchema = new Schema({
  restaurants: [],
});

module.exports = List = mongoose.model('List', ListSchema);
