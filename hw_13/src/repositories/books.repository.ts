import type { Book } from '../types/book.type.js';

/**
 * Абстрактный класс репозитория для работы с книгами.
 * Определяет контракт для всех реализаций репозитория.
 */
abstract class BooksRepository {
  abstract createBook(book: Book): void;
  abstract getBook(id: string): Book | null;
  abstract getBooks(): Book[];
  abstract updateBook(id: string, updatedBook: Book): void;
  abstract deleteBook(id: string): void;
}

export default BooksRepository;