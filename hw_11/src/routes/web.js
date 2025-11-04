import express from "express";
import {
  getBooksPage,
  getBookPage,
  getCreateBookPage,
  createBookAction,
  getEditBookPage,
  updateBookAction,
  deleteBookAction,
} from "../controllers/bookController.js";
import { ensureAuthenticated } from "../middleware/auth.js";

/**
 * Экземпляр роутера Express для веб-интерфейса
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * Главная страница приложения (требует аутентификации)
 * Показывает основной шаблон (например, index.ejs) или перенаправляет на /books
 */
router.get("/", ensureAuthenticated, (req, res) => {
  // Вариант 1: Рендерим index.ejs, передавая req.user
  res.render("index", { title: "Главная", user: req.user }); // user передается в шаблон

  // Вариант 2: Просто редиректим на /books (как было раньше, но теперь /books тоже защищен)
  // res.redirect('/books');
});

// /**
//  * Главная страница приложения
//  */
// router.get("/", (req, res) => {
//   res.render("index", { title: "Главная" });
// });

/**
 * Отображает список всех книг (требует аутентификации)
 */
router.get("/books", ensureAuthenticated, getBooksPage);

/**
 * Отображает форму создания новой книги (требует аутентификации)
 */
router.get("/books/create", ensureAuthenticated, getCreateBookPage);

/**
 * Отображает форму редактирования книги (требует аутентификации)
 * @param {string} id - ID книги из URL
 */
router.get("/books/:id/edit", ensureAuthenticated, getEditBookPage);

/**
 * Отображает страницу с детальной информацией о книге (требует аутентификации)
 * @param {string} id - ID книги из URL
 */
router.get("/books/:id", ensureAuthenticated, getBookPage);

/**
 * Создаёт новую книгу на основе данных формы (требует аутентификации)
 * @bodyParam {string} title - Название книги
 * @bodyParam {string} author - Автор
 * @bodyParam {number} year - Год издания
 */
router.post("/books", ensureAuthenticated, createBookAction);

/**
 * Обновляет данные существующей книги (требует аутентификации)
 * @param {string} id - ID книги из URL
 */
router.post("/books/:id", ensureAuthenticated, updateBookAction);

/**
 * Удаляет книгу по ID (требует аутентификации)
 * @param {string} id - ID книги из URL
 */
router.post("/books/:id/delete", ensureAuthenticated, deleteBookAction);

export default router;
