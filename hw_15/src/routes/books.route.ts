import { Router, type Request, type Response, type NextFunction } from 'express';
import { ContainerDefault } from '../container.js';
import BooksRepository from '../repositories/books.repository.js';
import type { Book } from '../types/book.type.js';

// подключение маршрута
const router = Router();

// вспомогательная функция для получения репозитория
const getRepo = () => ContainerDefault.get(BooksRepository);

// GET /api/books - получить список всех книг
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение репозитория
    const repo = getRepo();
    // Вызов метода репозитория
    const books = await repo.getBooks();
    // Отправка результата
    res.json(books);
  } catch (error) {
    console.error('Error in GET /api/books:', error);
    next(error);
  }
});

// GET /api/books/:id - получить книгу по ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение репозитория
    const repo = getRepo();

    // Проверка типа req.params.id
    const bookIdParam = req.params.id;
    if (Array.isArray(bookIdParam)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    const bookId = bookIdParam;

    // Вызов метода репозитория
    const book = await repo.getBook(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    // Отправка результата
    res.json(book);
  } catch (error) {
    console.error('Error in GET /api/books/:id:', error);
    next(error);
  }
});

// POST /api/books - создать новую книгу
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение репозитория
    const repo = getRepo();
    // Вызов метода репозитория с передачей тела запроса
    const newBook = await repo.createBook(req.body as Book);
    // Отправка результата с кодом 201
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error in POST /api/books:', error);
    if ((error as any).name === "ValidationError") {
      const message = Object.values((error as any).errors)
        .map((err: any) => err.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    next(error);
  }
});

// PUT /api/books/:id - обновить книгу по ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение репозитория
    const repo = getRepo();

    // Проверка типа req.params.id
    const bookIdParam = req.params.id;
    if (Array.isArray(bookIdParam)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    const bookId = bookIdParam;

    // Вызов метода репозитория с передачей тела запроса
    const updatedBook = await repo.updateBook(bookId, req.body as Book);
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Отправка результата
    res.json(updatedBook);
  } catch (error) {
    console.error('Error in PUT /api/books/:id:', error);
    if ((error as any).name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    if ((error as any).name === "ValidationError") {
      const message = Object.values((error as any).errors)
        .map((err: any) => err.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    next(error);
  }
});

// DELETE /api/books/:id - удалить книгу по ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение репозитория
    const repo = getRepo();

    // Проверка типа req.params.id
    const bookIdParam = req.params.id;
    if (Array.isArray(bookIdParam)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    const bookId = bookIdParam;

    // Вызов метода репозитория
    const deleted = await repo.deleteBook(bookId);
    if (!deleted) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Отправка результата
    res.status(200).send("ok");
  } catch (error) {
    console.error('Error in DELETE /api/books/:id:', error);
    if ((error as any).name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format" });
    }
    next(error);
  }
});

export default router;