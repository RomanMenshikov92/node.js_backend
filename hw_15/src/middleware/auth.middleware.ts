import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware для проверки аутентификации пользователя.
 * @function ensureAuthenticated
 * @param {Request} req - Объект запроса Express. Содержит информацию о сессии (req.session), проверяемой через req.isAuthenticated().
 * @param {Response} res - Объект ответа Express. Используется для перенаправления (res.redirect).
 * @param {NextFunction} next - Функция перехода к следующему middleware в цепочке.
 * @returns {void}
 */
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  // Проверка аутентификации пользователя
  if (req.isAuthenticated()) {
    // Переход к следующему middleware, если пользователь аутентифицирован
    return next();
  }
  // Редирект на страницу входа, если пользователь не аутентифицирован
  return res.redirect("/api/user/login");
};