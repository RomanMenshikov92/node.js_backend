import express from "express";
import {
  getBooksPage,
  getBookPage,
  getCreateBookPage,
  createBookAction,
  getEditBookPage,
  updateBookAction,
  deleteBookAction
} from "../controllers/bookController.js";

/**
 * Экземпляр роутера Express для веб-интерфейса
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * Главная страница приложения
 */
router.get("/", (req, res) => {
  res.render("index", { title: "Главная" });
});

/**
 * Отображает список всех книг
 */
router.get("/books", getBooksPage);

/**
 * Отображает форму создания новой книги
 */
router.get("/books/create", getCreateBookPage);

/**
 * Отображает форму редактирования книги
 * @param {string} id - ID книги из URL
 */
router.get("/books/:id/edit", getEditBookPage);

/**
 * Отображает страницу с детальной информацией о книге
 * @param {string} id - ID книги из URL
 */
router.get("/books/:id", getBookPage);

/**
 * Создаёт новую книгу на основе данных формы
 * @bodyParam {string} title - Название книги
 * @bodyParam {string} author - Автор
 * @bodyParam {number} year - Год издания
 */
router.post("/books", createBookAction);

/**
 * Обновляет данные существующей книги
 * @param {string} id - ID книги из URL
 */
router.post("/books/:id", updateBookAction);

/**
 * Удаляет книгу по ID
 * @param {string} id - ID книги из URL
 */
router.post("/books/:id/delete", deleteBookAction);

export default router;