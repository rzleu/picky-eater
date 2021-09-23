/* eslint-disable */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
  },
  {
    timestamps: true,
  },
);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

module.exports = User = mongoose.model('User', UserSchema);
