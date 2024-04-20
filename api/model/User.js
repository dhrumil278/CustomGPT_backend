const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    firstName: {
      type: 'string',
      required: true,
    },
    lastName: {
      type: 'string',
      required: true,
    },
    username: {
      type: 'string',
      default: '',
    },
    phone: {
      type: 'string',
      default: '',
    },
    country: {
      type: 'string',
      default: '',
    },
    isDeleted: {
      type: 'boolean',
      default: false,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    isVerified: {
      type: 'boolean',
      default: false,
    },
    accessToken: {
      type: 'string',
    },
    chatBots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatBot',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
