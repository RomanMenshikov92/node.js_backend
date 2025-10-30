/**
 * @file Контроллер для управления книгами (веб-интерфейс)
 * @module src/controllers/bookController
 */

import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../models/bookModel.js";


/**
 * Отображает страницу со списком всех книг
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getBooksPage = async (req, res, next) => { // <-- async
  try {
    const books = await getAllBooks(); // <-- await
    res.render("books/index", { books });
  } catch (error) {
    console.error('Error fetching books for page:', error);
    next(error); // Передаём ошибку в глобальный обработчик
  }
};

/**
 * Отображает страницу с детальной информацией о книге
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getBookPage = async (req, res, next) => { // <-- async
  try {
    const book = await getBookById(req.params.id); // <-- await
    if (!book) {
      const err = new Error("Книга не найдена");
      err.status = 404;
      return next(err);
    }
    res.render("books/view", { book });
  } catch (error) {
    // Обработка CastError или других ошибок Mongoose
    if (error.name === 'CastError') {
      const err = new Error("Неверный формат ID книги");
      err.status = 400;
      return next(err);
    }
    console.error('Error fetching book for page:', error);
    next(error);
  }
};

/**
 * Отображает форму создания новой книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @returns {void}
 */
export const getCreateBookPage = (req, res) => {
  res.render("books/create");
};

/**
 * Обрабатывает создание новой книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @returns {void}
 */
export const createBookAction = async (req, res) => { // <-- async
  try {
    const { title, description, authors } = req.body; // <-- Новые поля
    if (!title || !description || !authors) { // <-- Проверка новых полей
      return res.status(400).render("books/create", {
        error: "Все поля обязательны для заполнения", // <-- Обновить сообщение
        book: req.body
      });
    }
    // Создаём объект с нужными полями
    const bookData = { title, description, authors };
    await createBook(bookData); // <-- await
    res.redirect("/books");
  } catch (error) {
    // Обработка ошибок валидации Mongoose
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).render("books/create", {
        error: message,
        book: req.body
      });
    }
    console.error('Error creating book:', error);
    // В случае общей ошибки, можно перенаправить или отобразить ошибку
    res.status(500).render("errors/404", { title: "Ошибка сервера", message: "Не удалось создать книгу." });
  }
};

/**
 * Отображает форму редактирования книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getEditBookPage = async (req, res, next) => { // <-- async
  try {
    const book = await getBookById(req.params.id); // <-- await
    if (!book) {
      const err = new Error("Книга не найдена");
      err.status = 404;
      return next(err);
    }
    res.render("books/update", { book });
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error("Неверный формат ID книги");
      err.status = 400;
      return next(err);
    }
    console.error('Error fetching book for edit page:', error);
    next(error);
  }
};

/**
 * Обрабатывает обновление данных книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const updateBookAction = async (req, res, next) => { // <-- async
  try {
    const { title, description, authors } = req.body; // <-- Новые поля
    // Создаём объект с обновлёнными полями
    const updateData = { title, description, authors };
    const updated = await updateBook(req.params.id, updateData); // <-- await
    if (!updated) {
      const err = new Error("Книга не найдена");
      err.status = 404;
      return next(err);
    }
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error("Неверный формат ID книги");
      err.status = 400;
      return next(err);
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(err => err.message).join(', ');
      // Для редактирования, нужно передать *старые* данные книги и *новые* ошибки
      const book = await getBookById(req.params.id);
      if (!book) {
        const err404 = new Error("Книга не найдена");
        err404.status = 404;
        return next(err404);
      }
      return res.status(400).render("books/update", {
        error: message,
        book: { ...book.toObject(), ...req.body } // Объединяем данные
      });
    }
    console.error('Error updating book:', error);
    next(error);
  }
};

/**
 * Обрабатывает удаление книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const deleteBookAction = async (req, res, next) => { // <-- async
  try {
    const deleted = await deleteBook(req.params.id); // <-- await
    if (!deleted) {
      const err = new Error("Книга не найдена");
      err.status = 404;
      return next(err);
    }
    res.redirect("/books");
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error("Неверный формат ID книги");
      err.status = 400;
      return next(err);
    }
    console.error('Error deleting book:', error);
    next(error);
  }
};