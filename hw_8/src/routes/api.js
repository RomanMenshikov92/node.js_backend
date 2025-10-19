import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from "../models/bookModel.js";

/**
 * Роутер API
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * Получить список всех книг
 * @returns {Object[]} Массив книг
 */
router.get("/", (req, res) => {
  res.json(getAllBooks());
});

/**
 * Получить книгу по ID
 * @param {string} id - Уникальный идентификатор книги
 * @returns {Object} Данные книги или 404, если не найдена
 */
router.get("/:id", (req, res) => {
  const book = getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

/**
 * Создать новую книгу
 * @bodyParam {string} title - Название
 * @bodyParam {string} author - Автор
 * @bodyParam {number} year - Год издания
 * @returns {Object} Созданная книга с 201 статусом
 */
router.post("/", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: "All fields required" });
  }
  const newBook = createBook({ title, author, year: parseInt(year) });
  res.status(201).json(newBook);
});

/**
 * Обновить книгу по ID
 * @param {string} id - ID книги
 * @bodyParam {Object} - Обновлённые данные книги
 * @returns {Object} Обновлённая книга или 404
 */
router.put("/:id", (req, res) => {
  const updated = updateBook(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Book not found" });
  res.json(updated);
});

/**
 * Удалить книгу по ID
 * @param {string} id - ID книги
 * @returns {204} Успешное удаление или 404, если не найдена
 */
router.delete("/:id", (req, res) => {
  const deleted = deleteBook(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  res.status(204).send();
});

export default router;