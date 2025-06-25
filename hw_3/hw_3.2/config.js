/**
 * @file config.js
 * Конфигурация приложения: загружает переменные окружения и экспортирует настройки.
 */
require("dotenv").config(); // Для чтения .env файла

/**
 * @typedef {Object} Config
 * @property {string} apiKey - Ключ API для доступа к сервису погоды
 * @property {string} apiUrl - Базовый URL API
 * @property {string} apiVersion - Версия API
 * @property {string} defaultCity - Город по умолчанию
 */

/**
 * Объект конфигурации приложения
 * @type {Config}
 */
const Config = {
  apiKey: process.env.WEATHER_API_KEY || "default_key",
  apiUrl: process.env.WEATHER_API_URL || "http://api.weatherapi.com",
  apiVersion: process.env.WEATHER_API_VERSION || "/v1",
  defaultCity: process.env.WEATHER_DEFAULT_CITY || "Moscow",
};

module.exports = Config;
