const mongoose = require('mongoose');

const chatBotSchema = mongoose.Schema(
  {
    name: {
      type: 'string',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: 'boolean',
      default: false,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachments',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChatBot', chatBotSchema);
