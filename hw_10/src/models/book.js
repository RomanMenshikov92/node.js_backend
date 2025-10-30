import mongoose from 'mongoose';

/**
 * Mongoose-схема для документа книги
 * @type {mongoose.Schema}
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null
    },
    authors: {
      type: String,
      default: null
    },
    favorite: {
      type: Boolean,
      default: false
    },
    fileCover: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    fileBook: {
      type: String,
      default: null
    },
  },
  { versionKey: false },
);

/**
 * Mongoose-модель для взаимодействия с коллекцией 'books'
 * @type {mongoose.Model}
 */
const Book = mongoose.model('book', bookSchema);

export default Book;