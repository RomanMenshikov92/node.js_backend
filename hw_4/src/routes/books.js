import express from "express";
import { books } from "../data/books.js";

/** @type {import('express').Router} */
const router = express.Router();

/**
 * @description Получает список всех книг
 * @route GET /api/books
 * @returns {Book[]} 200 - Массив книг
 */
router.get("/books", (req, res) => {
  res.json(books);
});

/**
 * @description Получает книгу по ID
 * @route GET /api/books/:id
 * @param {string} id.path.required - ID книги
 * @returns {Book} 200 - Книга
 * @returns {Error} 404 - Книга не найдена
 */
router.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

/**
 * @description Создаёт новую книгу
 * @route POST /api/books
 * @param {Book} req.body - Данные книги
 * @returns {Book} 201 - Новая книга с ID
 */
router.post("/books", (req, res) => {
  const newBook = {
    id: Date.now().toString(),
    ...req.body,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

/**
 * @description Обновляет данные книги
 * @route PUT /api/books/:id
 * @param {string} id.path.required - ID книги
 * @param {Book} req.body - Обновлённые данные
 * @returns {Book} 200 - Обновлённая книга
 * @returns {Error} 404 - Книга не найдена
 */
router.put("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

/**
 * @description Удаляет книгу по ID
 * @route DELETE /api/books/:id
 * @param {string} id.path.required - ID книги
 * @returns {string} 200 - Результат: 'ok'
 * @returns {Error} 404 - Книга не найдена
 */
router.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  books.splice(index, 1);
  res.json("ok");
});

export default router;
