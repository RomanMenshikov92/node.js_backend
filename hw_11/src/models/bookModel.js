import Book from './book.js';

/**
 * Возвращает все книги из коллекции.
 * @async
 * @function getAllBooks
 * @returns {Promise<Object[]>} Промис, разрешающийся в массив всех книг.
 * @throws {Error} Выбрасывает ошибку, если возникает проблема при запросе к базе данных.
 */
export const getAllBooks = async () => {
  try {
    return await Book.find();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error; // Бросаем ошибку, чтобы обработать её в контроллере
  }
};

/**
 * Возвращает книгу по её уникальному идентификатору (ID).
 * @async
 * @function getBookById
 * @param {string} id - Уникальный идентификатор книги.
 * @returns {Promise<Object|null>} Промис, разрешающийся в найденную книгу или null, если книга не найдена.
 *                                 В случае ошибки валидации ID (CastError) возвращает null.
 * @throws {Error} Выбрасывает ошибку, если возникает проблема при запросе к базе данных (кроме CastError).
 */
export const getBookById = async (id) => {
  try {
    // Mongoose автоматически проверит валидность id
    const book = await Book.findById(id);
    return book;
  } catch (error) {
    if (error.name === 'CastError') {
      // Невалидный ID формата ObjectId
      return null;
    }
    console.error('Error fetching book by ID:', error);
    throw error;
  }
};

/**
 * Создаёт новую книгу в коллекции.
 * @async
 * @function createBook
 * @param {Object} bookData - Данные новой книги.
 * @param {string} bookData.title - Название книги (обязательно).
 * @param {string} [bookData.description] - Описание книги.
 * @param {string} [bookData.authors] - Автор(ы) книги.
 * @param {boolean} [bookData.favorite=false] - Является ли книга избранной.
 * @param {string} [bookData.fileCover] - URL или путь к обложке.
 * @param {string} [bookData.fileName] - Имя файла книги.
 * @param {string} [bookData.fileBook] - URL или путь к файлу книги.
 * @returns {Promise<Object>} Промис, разрешающийся в созданную книгу.
 * @throws {Error} Выбрасывает ошибку, если возникает проблема при сохранении (например, ошибка валидации).
 */
export const createBook = async (bookData) => {
  try {
    const newBook = new Book(bookData);
    return await newBook.save();
  } catch (error) {
    console.error('Error creating book:', error);
    // Валидация Mongoose выбросит ValidationError
    throw error;
  }
};

/**
 * Обновляет книгу по её уникальному идентификатору (ID).
 * @async
 * @function updateBook
 * @param {string} id - Уникальный идентификатор книги для обновления.
 * @param {Object} updatedData - Объект с полями, которые нужно обновить.
 * @param {string} [updatedData.title] - Новое название книги.
 * @param {string} [updatedData.description] - Новое описание книги.
 * @param {string} [updatedData.authors] - Новые автор(ы) книги.
 * @param {boolean} [updatedData.favorite] - Новое значение избранности.
 * @param {string} [updatedData.fileCover] - Новый URL или путь к обложке.
 * @param {string} [updatedData.fileName] - Новое имя файла книги.
 * @param {string} [updatedData.fileBook] - Новый URL или путь к файлу книги.
 * @returns {Promise<Object|null>} Промис, разрешающийся в обновлённую книгу или null, если книга не найдена.
 *                                 В случае ошибки валидации ID (CastError) возвращает null.
 * @throws {Error} Выбрасывает ошибку, если возникает проблема при обновлении (кроме CastError или отсутствия книги).
 */
export const updateBook = async (id, updatedData) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Возвращает обновленный документ и проверяет валидацию
    );
    return updatedBook;
  } catch (error) {
    if (error.name === 'CastError') {
      return null; // Книга не найдена или ID невалиден
    }
    console.error('Error updating book:', error);
    throw error;
  }
};

/**
 * Удаляет книгу по её уникальному идентификатору (ID).
 * @async
 * @function deleteBook
 * @param {string} id - Уникальный идентификатор книги для удаления.
 * @returns {Promise<boolean>} Промис, разрешающийся в true, если книга была найдена и удалена, иначе false.
 *                             В случае ошибки валидации ID (CastError) возвращает false.
 * @throws {Error} Выбрасывает ошибку, если возникает проблема при удалении (кроме CastError).
 */
export const deleteBook = async (id) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    return !!deletedBook;
  } catch (error) {
    if (error.name === 'CastError') {
      return false;
    }
    console.error('Error deleting book:', error);
    throw error;
  }
};
