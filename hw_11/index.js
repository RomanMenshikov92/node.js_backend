import "dotenv/config";
import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import errorMiddleware from "./src/middleware/error.js";
import webRouter from "./src/routes/web.js";
import booksApiRouter from "./src/routes/api.js";
import authRouter from './src/routes/auth.js';
import connectDB from "./src/config/database.js";
import initializePassport from "./src/config/passport.js";

/**
 * Экземпляр Express-приложения.
 * @type {import('express').Application}
 */
const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
connectDB();

// Настройка express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret_here',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Инициализация Passport и сессий Passport (после session)
initializePassport(app);

/**
 * Middleware для парсинга тела запроса
 */
app.use(express.json()); // для API (JSON)
app.use(express.urlencoded({ extended: true })); // для HTML-форм

/**
 * Настройка шаблонизатора EJS
 */
app.set("view engine", "ejs");
app.set("views", "./src/views");

/**
 * Middleware для статических файлов
 */
app.use(express.static("public"));

/**
 * Подключение роутов
 */
app.use("/", webRouter);
app.use("/api/books", booksApiRouter);
app.use(authRouter);

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
 * Запуск сервера
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
