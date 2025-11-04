import express from "express";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../models/bookModel.js";

/**
 * Роутер API
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * Получить список всех книг
 * @returns {Object[]} Массив книг
 */
router.get("/", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Получить книгу по ID
 * @param {string} id - Уникальный идентификатор книги
 * @returns {Object} Данные книги или 404, если не найдена
 */
router.get("/:id", async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Создать новую книгу
 * @bodyParam {string} title - Название (обязательно)
 * @bodyParam {string} description - Описание
 * @bodyParam {string} authors - Авторы
 * @bodyParam {string} favorite - Избранное
 * @bodyParam {string} fileCover - Обложка файла
 * @bodyParam {string} fileName - Имя файла
 * @returns {Object} Созданная книга с 201 статусом
 */
router.post("/", async (req, res) => {
  try {
    const newBook = await createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Обновить книгу по ID
 * @param {string} id - ID книги
 * @bodyParam {Object} - Обновлённые данные книги
 * @returns {Object} Обновлённая книга или 404
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await updateBook(req.params.id, req.body);
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Удалить книгу по ID
 * @param {string} id - ID книги
 * @returns {string} 'ok' при успешном удалении или 404, если не найдена
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteBook(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.status(200).send("ok");
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
