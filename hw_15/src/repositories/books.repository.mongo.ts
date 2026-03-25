import { injectable } from 'inversify';
import mongoose from 'mongoose';
import type { Book } from '../types/book.type.js';
import BooksRepository from './books.repository.js';

// Схема Mongoose для книги
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    authors: { type: String, default: null },
    favorite: { type: Boolean, default: false },
    fileCover: { type: String, default: null },
    fileName: { type: String, default: null },
    fileBook: { type: String, default: null },
    viewCount: { type: Number, default: 0 },
  },
  { versionKey: false }
);

// Модель Mongoose для взаимодействия с коллекцией 'books'
const BookModel = mongoose.model('book', bookSchema);

/**
 * Реализация репозитория книг, использующая MongoDB через Mongoose.
 * Наследует контракт из абстрактного класса BooksRepository.
 */
@injectable()
export default class BooksRepositoryMongo extends BooksRepository {
  /**
   * Создание новой книги в базе данных.
   * @async
   * @function createBook
   * @param {Omit<Book, '_id'>} book - Данные книги для создания (без _id).
   * @returns {Promise<Book>} Созданная книга (с _id).
   */
  async createBook(book: Omit<Book, '_id'>): Promise<Book> {
    // Создание Mongoose-документа
    const newBook = new BookModel(book);
    // Сохранение в базу
    const savedBook = await newBook.save();
    // Преобразование в plain object и возврат
    return savedBook.toObject() as Book;
  }

  /**
   * Получение книги по ID из базы данных.
   * @async
   * @function getBook
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<Book | null>} Найденная книга или null.
   */
  async getBook(id: string): Promise<Book | null> {
    try {
      // Поиск книги по ID
      const book = await BookModel.findById(id).exec();
      if (!book) return null;
      // Преобразование в plain object и возврат
      return book.toObject() as Book;
    } catch (error) {
      // Обработка ошибки, связанной с неверным форматом ID
      if ((error as mongoose.Error).name === 'CastError') {
        return null;
      }
      // Проброс других ошибок
      throw error;
    }
  }

  /**
   * Получение списка всех книг из базы данных.
   * @async
   * @function getBooks
   * @returns {Promise<Book[]>} Массив всех книг.
   */
  async getBooks(): Promise<Book[]> {
    // Поиск всех книг
    const books = await BookModel.find().exec();
    // Преобразование каждого документа в plain object
    return books.map(book => book.toObject() as Book);
  }

  /**
   * Обновление существующей книги в базе данных.
   * @async
   * @function updateBook
   * @param {string} id - Уникальный идентификатор книги.
   * @param {Partial<Omit<Book, '_id'>>} updatedBook - Обновлённые данные книги (без _id).
   * @returns {Promise<Book | null>} Обновленная книга или null, если не найдена.
   */
  async updateBook(id: string, updatedBook: Partial<Omit<Book, '_id'>>): Promise<Book | null> {
    try {
      // Обновление книги по ID и возврат обновленного документа
      const result = await BookModel.findByIdAndUpdate(id, updatedBook, { new: true, runValidators: true }).exec();
      // Преобразование результата в plain object или возврат null
      return result ? result.toObject() as Book : null;
    } catch (error) {
      // Обработка ошибки, связанной с неверным форматом ID
      if ((error as mongoose.Error).name === 'CastError') {
        return null;
      }
      // Проброс других ошибок
      throw error;
    }
  }

  /**
   * Удаление книги по ID из базы данных.
   * @async
   * @function deleteBook
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<boolean>} true, если удалено, иначе false.
   */
  async deleteBook(id: string): Promise<boolean> {
    try {
      // Удаление книги по ID
      const result = await BookModel.findByIdAndDelete(id).exec();
      // Возврат результата операции
      return !!result;
    } catch (error) {
      // Обработка ошибки, связанной с неверным форматом ID
      if ((error as mongoose.Error).name === 'CastError') {
        return false;
      }
      // Проброс других ошибок
      throw error;
    }
  }

  /**
   * Увеличение счётчика просмотров книги по её ID.
   * @async
   * @function incrementViewCount
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<Book | null>} Обновлённая книга с новым значением счётчика или null, если не найдена.
   */
  async incrementViewCount(id: string): Promise<Book | null> {
    try {
      // Обновление счётчика просмотров и возврат обновлённой книги
      const updatedBook = await BookModel.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true, runValidators: true }
      ).exec();
      // Преобразование результата в plain object или возврат null
      return updatedBook ? updatedBook.toObject() as Book : null;
    } catch (error) {
      // Обработка ошибки, связанной с неверным форматом ID
      if ((error as mongoose.Error).name === 'CastError') {
        return null;
      }
      // Проброс других ошибок
      throw error;
    }
  }
}