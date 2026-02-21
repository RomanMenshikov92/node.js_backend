import 'reflect-metadata';
import express, {type Express} from 'express';
import booksRouter from './src/routes/books.routes.js';

// Инициализация Express-приложения
const app: Express = express();
// Порт
const PORT: string | 3000 = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Регистрация маршрутов API
app.use('/api/books', booksRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});