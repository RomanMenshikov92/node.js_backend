import type { Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import BooksRepository from '../repositories/books.repository.js';
import { CommentRepository } from '../repositories/comment.repository.js';
import type { Book } from '../types/book.type.js';

/**
 * Отображение страницы со списком всех книг
 * @async
 * @function getBooksPage
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @param {NextFunction} next - Функция перехода к следующему middleware
 * @returns {Promise<void>}
 */
export const getBooksPage = async (container: Container, req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);
    // Вызов метода репозитория для получения книг
    const books = await booksRepo.getBooks();
    // Добавление id для совместимости с EJS-шаблоном
    const booksWithIds = books.map(book => ({ ...book, id: book._id }));
    // Рендеринг страницы списка книг
    res.render("books/index", { books: booksWithIds, user: req.user });
  } catch (error) {
    console.error("Error fetching books for page:", error);
    next(error);
  }
};

/**
 * Отображение страницы с детальной информацией о книге
 * @async
 * @function getBookPage
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @param {NextFunction} next - Функция перехода к следующему middleware
 * @returns {Promise<void>}
 */
export const getBookPage = async (container: Container, req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверка типа req.params.id
  const bookIdParam = req.params.id;
  let bookId: string;
  if (Array.isArray(bookIdParam)) {
    const err = new Error("Invalid book ID format");
    (err as any).status = 400;
    return next(err);
  }
  bookId = bookIdParam;

  try {
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);
    // Получение репозитория комментариев
    const commentRepo = container.get<CommentRepository>(CommentRepository);
    // Поиск книги по ID
    const book = await booksRepo.getBook(bookId);
    if (!book) {
      const err = new Error("Книга не найдена");
      (err as any).status = 404;
      return next(err);
    }
    // Инкремент просмотра
    const updatedBook = await booksRepo.incrementViewCount(bookId);
    // Поиск комментариев по ID книги
    const comments = await commentRepo.findByBookId(bookId);
    // Определение количества просмотров
    const viewCount = updatedBook?.viewCount ?? book.viewCount;
    // Добавление id для совместимости с EJS-шаблоном
    const bookWithId = { ...book, id: book._id };
    // Рендеринг страницы книги
    res.render("books/view", { book: bookWithId, viewCount, comments, user: req.user });
  } catch (error: any) {
    if (error.name === "CastError") {
      const err = new Error("Неверный формат ID книги");
      (err as any).status = 400;
      return next(err);
    }
    console.error("Error fetching book for page:", error);
    next(error);
  }
};

/**
 * Отображение формы создания новой книги
 * @function getCreateBookPage
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @returns {void}
 */
export const getCreateBookPage = (req: Request, res: Response): void => {
  // Рендеринг формы создания книги
  res.render("books/create", { user: req.user });
};

/**
 * Обработка создания новой книги
 * @async
 * @function createBookAction
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @returns {Promise<void>}
 */
export const createBookAction = async (container: Container, req: Request, res: Response): Promise<void> => {
  try {
    // Извлечение данных из тела запроса
    const { title, description, authors } = req.body;
    // Проверка обязательных полей
    if (!title || !description || !authors) {
      return res.status(400).render("books/create", {
        error: "Все поля обязательны для заполнения",
        book: req.body,
        user: req.user,
      });
    }
    // Подготовка данных для создания книги
    const bookData: Omit<Book, '_id'> = { title, description, authors };
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);
    // Создание книги через репозиторий
    await booksRepo.createBook(bookData);
    // Редирект на список книг
    res.redirect("/books");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      return res.status(400).render("books/create", {
        error: message,
        book: req.body,
        user: req.user,
      });
    }
    console.error("Error creating book:", error);
    res.status(500).render("error/404", { title: "Ошибка сервера", message: "Не удалось создать книгу.", user: req.user });
  }
};

/**
 * Отображение формы редактирования книги
 * @async
 * @function getEditBookPage
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @param {NextFunction} next - Функция перехода к следующему middleware
 * @returns {Promise<void>}
 */
export const getEditBookPage = async (container: Container, req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверка типа req.params.id
  const bookIdParam = req.params.id;
  let bookId: string;
  if (Array.isArray(bookIdParam)) {
    const err = new Error("Invalid book ID format");
    (err as any).status = 400;
    return next(err);
  }
  bookId = bookIdParam;

  try {
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);
    // Поиск книги по ID
    const book = await booksRepo.getBook(bookId);
    if (!book) {
      const err = new Error("Книга не найдена");
      (err as any).status = 404;
      return next(err);
    }
    // Добавление id для совместимости с EJS-шаблоном
    const bookWithId = { ...book, id: book._id };
    // Рендеринг формы редактирования книги
    res.render("books/update", { book: bookWithId, user: req.user });
  } catch (error: any) {
    if (error.name === "CastError") {
      const err = new Error("Неверный формат ID книги");
      (err as any).status = 400;
      return next(err);
    }
    console.error("Error fetching book for edit page:", error);
    next(error);
  }
};

/**
 * Обработка обновления данных книги
 * @async
 * @function updateBookAction
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @param {NextFunction} next - Функция перехода к следующему middleware
 * @returns {Promise<void>}
 */
export const updateBookAction = async (container: Container, req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверка типа req.params.id
  const bookIdParam = req.params.id;
  let bookId: string;
  if (Array.isArray(bookIdParam)) {
    const err = new Error("Invalid book ID format");
    (err as any).status = 400;
    return next(err);
  }
  bookId = bookIdParam;

  try {
    // Извлечение данных из тела запроса
    const { title, description, authors } = req.body;
    // Подготовка данных для обновления
    const updateData: Partial<Omit<Book, '_id'>> = { title, description, authors };
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);
    // Обновление книги через репозиторий
    const updatedBook = await booksRepo.updateBook(bookId, updateData);

    if (!updatedBook) {
       const err = new Error("Книга не найдена");
       (err as any).status = 404;
       return next(err);
    }
    // Редирект на страницу книги
    res.redirect(`/books/${bookId}`);
  } catch (error: any) {
    if (error.name === "CastError") {
      const err = new Error("Неверный формат ID книги");
      (err as any).status = 400;
      return next(err);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");

      // Получение репозитория книг для повторного получения книги
      const booksRepo = container.get<BooksRepository>(BooksRepository);
      // Поиск книги по ID
      const book = await booksRepo.getBook(bookId);
      if (!book) {
        const err404 = new Error("Книга не найдена");
        (err404 as any).status = 404;
        return next(err404);
      }
      // Добавление id для совместимости с EJS-шаблоном
      const bookWithId = { ...book, id: book._id };
      // Рендеринг формы редактирования с ошибкой
      return res.status(400).render("books/update", {
        error: message,
        book: { ...bookWithId, ...req.body },
        user: req.user,
      });
    }
    console.error("Error updating book:", error);
    next(error);
  }
};

/**
 * Обработка удаления книги
 * @async
 * @function deleteBookAction
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса
 * @param {Response} res - Объект ответа
 * @param {NextFunction} next - Функция перехода к следующему middleware
 * @returns {Promise<void>}
 */
export const deleteBookAction = async (container: Container, req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверка типа req.params.id
  const bookIdParam = req.params.id;
  let bookId: string;
  if (Array.isArray(bookIdParam)) {
    const err = new Error("Invalid book ID format");
    (err as any).status = 400;
    return next(err);
  }
  bookId = bookIdParam;

  try {
    // Получение репозитория книг
    const booksRepo = container.get<BooksRepository>(BooksRepository);

    // Получение репозитория книг
    const deleted = await booksRepo.deleteBook(bookId);

    if (!deleted) {
      const err = new Error("Книга не найдена");
      (err as any).status = 404;
      return next(err);
    }

    // Редирект на список книг
    res.redirect("/books");
  } catch (error: any) {
    if (error.name === "CastError") {
      const err = new Error("Неверный формат ID книги");
      (err as any).status = 400;
      return next(err);
    }
    console.error("Error deleting book:", error);
    next(error);
  }
};