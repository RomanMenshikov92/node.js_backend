/**
 * Тип данных книги
 * @typedef {Object} Book
 * @property {string} id - Уникальный идентификатор книги
 * @property {string} title - Название книги
 * @property {string} description - Описание книги
 * @property {string} authors - Автор(ы) книги
 * @property {string} favorite - Отметка "в избранном"
 * @property {string} fileCover - Путь к обложке книги
 * @property {string} fileName - Имя файла книги
 */

/**
 * Список книг
 * @type {Book[]}
 */
export let books = [
  {
    id: "1",
    title: "Book One",
    description: "Description of Book One",
    authors: "Author A",
    favorite: "Yes",
    fileCover: "cover1.jpg",
    fileName: "book1.pdf",
  },
];
