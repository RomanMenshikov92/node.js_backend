import 'reflect-metadata';
import express, {type Express} from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import session from 'express-session';
import path from 'path';
import { ContainerDefault } from './src/container.js';
import connectDB from './src/configs/database.config.js';
import { initializePassportConfig } from './src/configs/passport.config.js';
import { initializeSocketIO } from './src/configs/socket.config.js';
import sessionConfig from './src/configs/session.config.js';
import authRoutes from './src/routes/auth.route.js';
import webRoutes from './src/routes/web.route.js';
import booksRoutes from './src/routes/books.route.js';
import errorMiddleware from './src/middleware/error.middleware.js';

// Инициализация Express-приложения
const app: Express = express();
// Порт
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Подключение к БД
connectDB();

// Настройка сессии
app.use(session(sessionConfig));

// Инициализация Passport
initializePassportConfig(app, ContainerDefault);

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Middleware для статических файлов
app.use(express.static(path.join(process.cwd(), 'public')));

// Создание HTTP-сервера и инициализация Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
initializeSocketIO(io, ContainerDefault);

// Регистрация маршрутов API
app.use('/', webRoutes);
app.use('/api/books', booksRoutes);
app.use(authRoutes);

// Catch-all middleware для 404 ошибок
app.use((_req, _res, next) => {
  const err = new Error('Страница не найдена');
  (err as any).status = 404;
  next(err);
});

// Обработка ошибок
app.use(errorMiddleware);

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app, server };