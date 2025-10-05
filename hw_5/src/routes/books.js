import express from "express";
import fs from "fs";
import path from "path";
import { books } from "../data/books.js";
import upload from "../middleware/upload.js";

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
 * @description Создаёт новую книгу с загрузкой файла
 * @route POST /api/books
 * @consumes multipart/form-data
 * @param {string} title.formData.required - Название книги
 * @param {string} description.formData - Описание книги
 * @param {string} authors.formData - Автор(ы) книги
 * @param {boolean} favorite.formData - В избранном
 * @param {string} fileCover.formData - Путь/URL обложки
 * @param {string} fileName.formData - Отображаемое имя файла
 * @param {File} fileBook.formData.required - Файл книги
 * @returns {Book} 201 - Успешно созданная книга с ID и именем файла
 * @returns {Error} 400 - Отсутствует обязательное поле
 * @returns {Error} 500 - Ошибка сервера при обработке запроса
 */
router.post("/books", upload.single('fileBook'), (req, res) => {
  try {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const isFavorite = favorite === 'true' || favorite === true;

    const newBook = {
      id: Date.now().toString(),
      title,
      description: description || '',
      authors: authors || '',
      favorite: isFavorite,
      fileCover: fileCover || '',
      fileName: fileName || (req.file?.originalname || ''),
      fileBook: req.file ? req.file.filename : null,
    };

    if (!newBook.fileBook) {
      return res.status(400).json({ error: "Book file is required" });
    }

    books.push(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create book" });
  }
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

/**
 * @description Скачивает файл книги по её ID
 * @route GET /api/books/{id}/download
 * @param {string} id.path.required - Уникальный идентификатор книги
 * @returns {File} 200 - Файл книги для скачивания
 * @returns {Error} 404 - Книга не найдена или файл отсутствует
 * @returns {Error} 500 - Ошибка при отправке файла
 */
router.get("/books/:id/download", (req, res) => {
  const { id } = req.params;
  const book = books.find(b => b.id === id);

  if (!book || !book.fileBook) {
    return res.status(404).json({ error: "Book file not found" });
  }

  const filePath = path.resolve('./uploads', book.fileBook);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found on server" });
  }

  res.download(filePath, book.fileName || book.fileBook, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "Error downloading file" });
    }
  });
});

export default router;
