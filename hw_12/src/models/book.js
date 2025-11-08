import mongoose from "mongoose";

/**
 * Mongoose-схема для документа книги.
 * Определяет структуру и типы данных для коллекции 'books'.
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
      default: null,
    },
    authors: {
      type: String,
      default: null,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    fileCover: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileBook: {
      type: String,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

/**
 * Mongoose-модель для взаимодействия с коллекцией 'books'.
 * Предоставляет методы для CRUD операций с документами книг.
 * @type {mongoose.Model}
 */
const Book = mongoose.model("book", bookSchema);

export default Book;
