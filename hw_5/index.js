import express from "express";
import booksRouter from "./src/routes/books.js";

/**
 * Создание экземпляра Express приложения
 * @type {import('express').Express}
 */
const app = express();
const PORT = 3000;

/**
 * ======================================================
 * Парсинг JSON-запросов
 * ======================================================
 */
app.use(express.json());

/**
 * ======================================================
 * Подключение маршрутов книг под префиксом /api
 * ======================================================
 */
app.use("/api", booksRouter);

/**
 * Роут: Авторизация пользователя
 * @route POST /api/user/login
 * @desc Всегда возвращает статичный ответ
 * @returns {object} 201 - Успешный ответ с данными пользователя
 */
app.post("/api/user/login", (req, res) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

/**
 * ======================================================
 * Запуск сервера на порту 3000
 * ======================================================
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
