import express from "express";
import {
  getLoginPage,
  getSignupPage,
  postLogin,
  postSignup,
  getProfile,
  logout
} from "../controllers/authController.js";

/**
 * Экземпляр роутера Express для маршрутов аутентификации.
 * @type {import('express').Router}
 */
const router = express.Router();

router.get("/api/user/login", getLoginPage);
router.post("/api/user/login", postLogin);
router.get("/api/user/signup", getSignupPage);
router.post("/api/user/signup", postSignup);
router.get("/api/user/me", getProfile);
router.get("/api/user/logout", logout);

export default router;