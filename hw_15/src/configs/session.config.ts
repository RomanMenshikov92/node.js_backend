import type { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

/**
 * Конфигурация сессий Express
 */
export const sessionConfig: SessionOptions = {
  // Секретный ключ для подписи сессионного cookie
  secret: process.env.SESSION_SECRET || 'secret_here',
  // Отключение повторного сохранения неизменённой сессии
  resave: false,
  // Отключение сохранения неинициализированной сессии
  saveUninitialized: false,
  // Хранилище сессий в MongoDB
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI!
  }),
  // Параметры cookie
  cookie: {
    // Флаг безопасного соединения
    secure: process.env.NODE_ENV === 'production',
    // Защита от XSS-атак
    httpOnly: true,
    // Время жизни сессии (24 часа в миллисекундах)
    maxAge: 24 * 60 * 60 * 1000,
  },
};

// Экспорт по умолчанию для удобства импорта
export default sessionConfig;