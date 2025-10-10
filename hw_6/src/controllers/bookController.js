/**
 * @file Контроллер для управления книгами (веб-интерфейс)
 * @module src/controllers/bookController
 */

import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from "../models/bookModel.js";

/**
 * Отображает страницу со списком всех книг
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getBooksPage = (req, res) => {
  const books = getAllBooks();
  res.render("books/index", { books });
};

/**
 * Отображает страницу с детальной информацией о книге
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getBookPage = (req, res, next) => {
  const book = getBookById(req.params.id);
  if (!book) {
    const err = new Error("Книга не найдена");
    err.status = 404;
    return next(err);
  }
  res.render("books/view", { book });
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
export const createBookAction = (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).render("books/create", {
      error: "Все поля обязательны для заполнения",
      book: req.body
    });
  }
  createBook({ title, author, year: parseInt(year, 10) });
  res.redirect("/books");
};

/**
 * Отображает форму редактирования книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const getEditBookPage = (req, res, next) => {
  const book = getBookById(req.params.id);
  if (!book) {
    const err = new Error("Книга не найдена");
    err.status = 404;
    return next(err);
  }
  res.render("books/update", { book });
};

/**
 * Обрабатывает обновление данных книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const updateBookAction = (req, res, next) => {
  const { title, author, year } = req.body;
  const updated = updateBook(req.params.id, {
    title,
    author,
    year: parseInt(year, 10)
  });
  if (!updated) {
    const err = new Error("Книга не найдена");
    err.status = 404;
    return next(err);
  }
  res.redirect(`/books/${req.params.id}`);
};

/**
 * Обрабатывает удаление книги
 * @param {import('express').Request} req - Объект запроса
 * @param {import('express').Response} res - Объект ответа
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware
 * @returns {void}
 */
export const deleteBookAction = (req, res, next) => {
  const deleted = deleteBook(req.params.id);
  if (!deleted) {
    const err = new Error("Книга не найдена");
    err.status = 404;
    return next(err);
  }
  res.redirect("/books");
};