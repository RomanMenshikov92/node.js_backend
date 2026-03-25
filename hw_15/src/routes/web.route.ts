import { Router } from 'express';
import { ContainerDefault } from '../container.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';
import {
  getBooksPage,
  getBookPage,
  getCreateBookPage,
  createBookAction,
  getEditBookPage,
  updateBookAction,
  deleteBookAction,
} from '../controllers/book.controller.js';

// подключение маршрута
const router = Router();

// главная страница
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index", { title: "Главная", user: req.user });
});

// страница списка книг
router.get("/books", ensureAuthenticated, (req, res, next) => getBooksPage(ContainerDefault, req, res, next));

// страница создания книги
router.get("/books/create", ensureAuthenticated, getCreateBookPage);

// страница редактирования книги
router.get("/books/:id/edit", ensureAuthenticated, (req, res, next) => getEditBookPage(ContainerDefault, req, res, next));

// страница просмотра книги
router.get("/books/:id", ensureAuthenticated, (req, res, next) => getBookPage(ContainerDefault, req, res, next));

// обработка создания книги
router.post("/books", ensureAuthenticated, (req, res) => createBookAction(ContainerDefault, req, res));

// обработка обновления книги
router.post("/books/:id", ensureAuthenticated, (req, res, next) => updateBookAction(ContainerDefault, req, res, next));

// обработка удаления книги
router.post("/books/:id/delete", ensureAuthenticated, (req, res, next) => deleteBookAction(ContainerDefault, req, res, next));

export default router;