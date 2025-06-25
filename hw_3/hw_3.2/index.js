#!/usr/bin/env node

/**
 * @file index.js
 * Консольное приложение для получения прогноза погоды.
 * Использует модуль http и WeatherAPI.
 */
const http = require("http");
const Config = require("./config");

// ----------------------------
// Типы данных из API
// ----------------------------

/**
 * @typedef {Object} Condition
 * @property {string} text - Описание погодного условия (на английском)
 * @property {string} icon - URL к иконке погоды
 * @property {number} code - Код погодного условия
 */

/**
 * @typedef {Object} Location
 * @property {string} name - Название города
 * @property {string} region - Регион
 * @property {string} country - Страна
 * @property {string} localtime - Локальное время
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {string} last_updated - Время последнего обновления
 * @property {number} temp_c - Температура в градусах Цельсия
 * @property {number} temp_f - Температура в градусах Фаренгейта
 * @property {number} is_day - 1 — день, 0 — ночь
 * @property {Condition[]} condition - Массив описаний погоды
 * @property {number} wind_kph - Скорость ветра в км/ч
 * @property {string} wind_dir - Направление ветра
 * @property {number} humidity - Влажность в процентах
 * @property {number} feelslike_c - Ощущаемая температура в °C
 */

/**
 * @typedef {Object} WeatherApiResponse
 * @property {Location} location - Информация о местоположении
 * @property {CurrentWeather} current - Текущие погодные данные
 */

// ----------------------------
// Перевод погодных условий
// ----------------------------

/**
 * Переводит описание погодного условия с английского на русский.
 *
 * @param {string} text - Текстовое описание погодного условия на английском
 * @returns {string} - Переведённое описание или оригинальный текст, если перевод отсутствует
 */
const translateCondition = (text) => {
  const translations = {
    Sunny: "Солнечно",
    Clear: "Ясно",
    "Partly cloudy": "Переменная облачность",
    Cloudy: "Облачно",
    Overcast: "Пасмурно",
    "Light rain": "Лёгкий дождь",
    "Moderate rain": "Умеренный дождь",
    "Heavy rain": "Сильный дождь",
    "Patchy light rain with thunder": "Местами слабый дождь с грозой",
    Snow: "Снег",
    Fog: "Туман",
    Thunderstorm: "Гроза",
    Drizzle: "Моросящий дождь",
    "Freezing fog": "Морозный туман",
  };

  return translations[text] || text;
};

// ----------------------------
// Получение аргументов и параметров
// ----------------------------
const city = process.argv[2] || Config.defaultCity;

const options = {
  host: new URL(Config.apiUrl).hostname,
  path: `${Config.apiVersion}/current.json?key=${Config.apiKey}&q=${encodeURIComponent(city)}`,
};

// ----------------------------
// Запрос к API
// ----------------------------

/**
 * Выполняет HTTP-запрос к API погоды и выводит результат в консоль.
 */
const req = http.get(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      /** @type {WeatherApiResponse} */
      const json = JSON.parse(data);

      if (json.error) {
        console.error(`Ошибка от API: ${json.error.message}`);
        return;
      }

      /** @type {Location} */
      const location = json.location;
      /** @type {CurrentWeather} */
      const current = json.current;

      const conditionTextRu = translateCondition(current.condition.text);

      console.log(`\n🌤  Погода в городе: ${location.name}, ${location.region}, ${location.country}`);
      console.log(`🕒 Время: ${location.localtime}`);
      console.log(`🌡  Температура: ${current.temp_c}°C (${current.temp_f}°F)`);
      console.log(`📌 Условие: ${conditionTextRu}`);
      console.log(`🌬  Ветер: ${current.wind_kph} км/ч (${current.wind_dir})`);
      console.log(`💧 Влажность: ${current.humidity}%`);
      console.log(`🔥 Ощущается как: ${current.feelslike_c}°C\n`);
    } catch (e) {
      console.error("Не удалось обработать ответ:", e.message);
      console.error("Полученные сырые данные:\n", data);
    }
  });
});

req.on("error", (e) => {
  console.error(`❌ Ошибка запроса: ${e.message}`);
});
