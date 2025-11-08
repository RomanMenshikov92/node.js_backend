import mongoose from 'mongoose';

/**
 * Mongoose-схема для документа комментария.
 * @type {mongoose.Schema}
 */
const commentSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Mongoose-модель для взаимодействия с коллекцией 'comments'.
 * @type {mongoose.Model}
 */
const Comment = mongoose.model('comment', commentSchema);

export default Comment;