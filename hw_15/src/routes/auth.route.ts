import { Router } from 'express';
import { ContainerDefault } from '../container.js';
import {
  getLoginPage,
  getSignupPage,
  postLogin,
  getProfile,
  logout,
  postSignup
} from '../controllers/auth.controller.js';

// подключение маршрута
const router = Router();

// маршрут получения страницы входа
router.get("/api/user/login", getLoginPage);
// маршрут обработки входа
router.post("/api/user/login", postLogin);
// маршрут получения страницы регистрации
router.get("/api/user/signup", getSignupPage);
// маршрут обработки регистрации
router.post("/api/user/signup", (req, res) => postSignup(ContainerDefault, req, res));
// маршрут получения страницы профиля
router.get("/api/user/me", getProfile);
// маршрут выхода
router.get("/api/user/logout", logout);

export default router;