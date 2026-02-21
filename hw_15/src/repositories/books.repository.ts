import type { Book } from "../types/book.type.js";

/**
 * Абстрактный класс репозитория для работы с книгами.
 * Определяет контракт для всех реализаций репозитория.
 */
abstract class BooksRepository {
  /**
   * Создание новой книги.
   * @param {Book} book - Данные книги для создания.
   * @returns {Promise<void>}
   */
  abstract createBook(book: Book): Promise<void>;

  /**
   * Получение книги по уникальному идентификатору.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<Book | null>} Найденная книга или null.
   */
  abstract getBook(id: string): Promise<Book | null>;

  /**
   * Получение списка всех книг.
   * @returns {Promise<Book[]>} Массив всех книг.
   */
  abstract getBooks(): Promise<Book[]>;

  /**
   * Обновление существующей книги.
   * @param {string} id - Уникальный идентификатор книги.
   * @param {Book} updatedBook - Обновлённые данные книги.
   * @returns {Promise<void>}
   */
  abstract updateBook(id: string, updatedBook: Book): Promise<void>;

  /**
   * Удаление книги по уникальному идентификатору.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<void>}
   */
  abstract deleteBook(id: string): Promise<void>;
}
export default BooksRepository;
