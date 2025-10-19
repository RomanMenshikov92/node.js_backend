/**
 * @file In-memory модель данных для книг
 * @module src/models/bookModel
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Массив книг (временное хранилище в памяти)
 * @type {Array<{id: string, title: string, author: string, year: number}>}
 */
let books = [
  { id: uuidv4(), title: "Война и мир", author: "Лев Толстой", year: 1869 },
  { id: uuidv4(), title: "1984", author: "Джордж Оруэлл", year: 1949 },
  { id: uuidv4(), title: "Мастер и Маргарита", author: "Михаил Булгаков", year: 1967 },
  { id: uuidv4(), title: "Философские труды Никколо Макиавелли «Государь»", author: "Никколо Макиавелли", year: 1513 },
  { id: uuidv4(), title: "Путешествия Гулливера", author: "Джонатан Свифт", year: 1726 },
  { id: uuidv4(), title: "Капитал", author: "Карла Маркс", year: 1867 },
];

/**
 * Возвращает все книги
 * @returns {Array} Массив всех книг
 */
export const getAllBooks = () => books;

/**
 * Возвращает книгу по ID
 * @param {string} id - Уникальный идентификатор книги
 * @returns {Object|null} Найденная книга или null
 */
export const getBookById = (id) => books.find(book => book.id === id);

/**
 * Создаёт новую книгу
 * @param {Object} bookData - Данные новой книги
 * @param {string} bookData.title - Название
 * @param {string} bookData.author - Автор
 * @param {number} bookData.year - Год издания
 * @returns {Object} Созданная книга
 */
export const createBook = (bookData) => {
  const newBook = {
    id: uuidv4(),
    ...bookData
  };
  books.push(newBook);
  return newBook;
};

/**
 * Обновляет книгу по ID
 * @param {string} id - ID книги
 * @param {Object} updatedData - Обновлённые данные
 * @returns {Object|null} Обновлённая книга или null
 */
export const updateBook = (id, updatedData) => {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updatedData };
  return books[index];
};

/**
 * Удаляет книгу по ID
 * @param {string} id - ID книги
 * @returns {boolean} true, если удалена, иначе false
 */
export const deleteBook = (id) => {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
};
