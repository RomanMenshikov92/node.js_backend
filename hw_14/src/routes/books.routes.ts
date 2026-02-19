import { Router, type Request, type Response, type NextFunction } from 'express';
import { ContainerDefault } from '../container.js';
import BooksRepository from '../repositories/books.repository.js';
import type { Book } from '../types/book.type.js';

// Инициализация роутера Express
const router: Router = Router();

/**
 * Получение книги по ID.
 * @param {Request} req - Запрос Express
 * @param {Response} res - Ответ Express
 * @param {NextFunction} next - Следующий middleware
 * @returns {Promise<void>}
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Получение экземпляра репозитория из контейнера
    const repo: BooksRepository = ContainerDefault.get(BooksRepository);
    const id: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const book: Book | null = await repo.getBook(id);
    res.json(book);
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * Получение всех книг.
 * @param {Request} req - Запрос Express
 * @param {Response} res - Ответ Express
 * @param {NextFunction} next - Следующий middleware
 * @returns {Promise<void>}
 */
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Получение экземпляра репозитория из контейнера
    const repo: BooksRepository = ContainerDefault.get(BooksRepository);
    const books: Book[] = await repo.getBooks();
    res.json(books);
  } catch (error: unknown) {
    next(error);
  }
});

export default router;