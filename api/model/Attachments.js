const mongoose = require('mongoose');
const { DOCUMENT_TYPE } = require('../../config/constant');

const attachmentsSchema = mongoose.Schema(
  {
    filename: {
      type: 'string',
      required: true,
    },
    size: {
      type: 'string',
    },
    fileType: {
      type: 'string',
      required: true,
    },
    namespace: {
      type: 'string',
      required: true,
    },
    documentType: {
      type: 'string',
      enum: [DOCUMENT_TYPE.DOCUMENTS, DOCUMENT_TYPE.TEXT, DOCUMENT_TYPE.WEB],
      required: true,
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
