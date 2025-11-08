/**
 * Middleware для проверки аутентификации пользователя.
 * Если пользователь не аутентифицирован (req.isAuthenticated() возвращает false),
 * перенаправляет на маршрут /api/user/login.
 * В противном случае, передает управление следующему middleware (next()).
 *
 * @param {import('express').Request} req - Объект запроса Express. Содержит информацию о сессии (req.session), проверяемой через req.isAuthenticated().
 * @param {import('express').Response} res - Объект ответа Express. Используется для перенаправления (res.redirect).
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware в цепочке.
 * @returns {void}
 */
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Пользователь аутентифицирован, продолжаем
  }
  // Перенаправляем на страницу входа
  return res.redirect("/api/user/login");
};
