const mongoose = require('mongoose');

const attachmentsSchema = mongoose.Schema(
  {
    filename: {
      type: 'string',
      required: true,
    },
    size: {
      type: 'string',
      required: true,
    },
    fileType: {
      type: 'string',
    },
    isDeleted: {
      type: 'boolean',
      default: false,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    chatBotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatBot',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attachments', attachmentsSchema);
