import { type Book } from "../types/book.type.js";
import BooksRepository from "./books.repository.js";

/**
 * Конкретная реализация репозитория книг.
 * Содержит заглушки для демонстрации DI.
 */
class BooksRepositoryMongo extends BooksRepository {
  /**
   * Создание новой книги.
   * @param {Book} book - Данные книги для создания.
   * @returns {Promise<void>}
   */
  async createBook(book: Book): Promise<void> {
    console.log("Creating book:", book.title);
  }

  /**
   * Получение книги по уникальному идентификатору.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<Book | null>} Найденная книга или null.
   */
  async getBook(id: string): Promise<Book | null> {
    console.log("Getting book by ID:", id);
    return null;
  }

  /**
   * Получение списка всех книг.
   * @returns {Promise<Book[]>} Массив всех книг.
   */
  async getBooks(): Promise<Book[]> {
    console.log("Getting all books");
    return [];
  }

  /**
   * Обновление существующей книги.
   * @param {string} id - Уникальный идентификатор книги.
   * @param {Book} updatedBook - Обновлённые данные книги.
   * @returns {Promise<void>}
   */
  async updateBook(id: string, updatedBook: Book): Promise<void> {
    console.log("Updating book:", updatedBook.title, id);
  }

  /**
   * Удаление книги по уникальному идентификатору.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<void>}
   */
  async deleteBook(id: string): Promise<void> {
    console.log("Deleting book:", id);
  }
}

export default BooksRepositoryMongo;
