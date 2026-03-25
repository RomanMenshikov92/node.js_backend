import type { Book } from "../types/book.type.js";

/**
 * Абстрактный класс репозитория для работы с книгами.
 * Определяет контракт для всех реализаций репозитория.
 */
abstract class BooksRepository {
  /**
   * Создание новой книги.
   * @param {Omit<Book, '_id'>} book - Данные книги для создания (без _id).
   * @returns {Promise<Book>} Созданная книга (с _id).
   */
  abstract createBook(book: Omit<Book, '_id'>): Promise<Book>;

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
   * @param {Partial<Omit<Book, '_id'>>} updatedBook - Обновлённые данные книги (без _id).
   * @returns {Promise<Book | null>} Обновленная книга или null, если не найдена.
   */
  abstract updateBook(id: string, updatedBook: Partial<Omit<Book, '_id'>>): Promise<Book | null>;

  /**
   * Удаление книги по уникальному идентификатору.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<boolean>} true, если удалено, иначе false.
   */
  abstract deleteBook(id: string): Promise<boolean>;

  /**
   * Увеличение счётчика просмотров книги по её ID.
   * @param {string} id - Уникальный идентификатор книги.
   * @returns {Promise<Book | null>} Обновлённая книга с новым значением счётчика или null, если не найдена.
   */
  abstract incrementViewCount(id: string): Promise<Book | null>;
}
export default BooksRepository;