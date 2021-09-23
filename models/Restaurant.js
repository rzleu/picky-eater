const mongoose = require('mongoose');

const { Schema } = mongoose;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

RestaurantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

module.exports = Restaurant = mongoose.model(
  'Restaurant',
  RestaurantSchema,
);
