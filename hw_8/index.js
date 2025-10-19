import express from "express";
import errorMiddleware from "./src/middleware/error.js";
import webRouter from "./src/routes/web.js";
import booksApiRouter from "./src/routes/api.js";

/**
 * Создание экземпляра Express приложения
 * @type {import('express').Express}
 */
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ======================================================
 * Middleware для парсинга тела запроса
 * ======================================================
 */
app.use(express.json()); // для API (JSON)
app.use(express.urlencoded({ extended: true })); // для HTML-форм

/**
 * ======================================================
 * Настройка шаблонизатора EJS
 * ======================================================
 */
app.set("view engine", "ejs");
app.set("views", "./src/views");

/**
 * ======================================================
 * Подключение шаблонизатора
 * ======================================================
 */
app.use(express.static("public"));

/**
 * ======================================================
 * Статические файлы (CSS, Image)
 * ======================================================
 */
app.use("/", webRouter); // Веб-интерфейс (рендерит HTML через EJS)
app.use("/api/books", booksApiRouter); // API-эндпоинты (возвращают JSON)

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
 * Catch-all middleware для 404 ошибок
 */
app.use((req, res, next) => {
  const err = new Error("Страница не найдена");
  err.status = 404;
  next(err);
});

/**
 * Middleware обработки ошибок
 */
app.use(errorMiddleware);

/**
 * ======================================================
 * Запуск сервера
 * ======================================================
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
