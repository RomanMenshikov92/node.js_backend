/**
 * Обрабатывает все ошибки, возникающие в приложении.
 *
 * - Если ошибка имеет статус 404 (Not Found), рендерит страницу 404.
 * - Для остальных ошибок (500 и выше) логирует стек и показывает страницу ошибки.
 * - Всегда отвечает HTML-страницей при веб-запросах.
 *
 * @param {Error} err - Объект ошибки
 * @param {import('express').Request} req - Объект запроса Express
 * @param {import('express').Response} res - Объект ответа Express
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware (обязательна в сигнатуре)
 * @returns {void}
 */
function errorMiddleware(err, req, res, next) {
  // Логируем ошибку
  console.error("[ERROR]", err.stack || err.toString());

  // Определяем статус
  const statusCode = err.status || err.statusCode || 500;

  // Если клиент ожидает HTML (веб-запрос)
  if (req.accepts("html")) {
    if (statusCode === 404) {
      return res.status(404).render("errors/404", {
        title: "Страница не найдена",
      });
    }
    // Для 500+ ошибок — также используем 404.ejs (по структуре проекта)
    return res.status(statusCode).render("errors/404", {
      title: "Ошибка сервера",
      message: "Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.",
    });
  }

  // API-запрос → JSON
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
}

export default errorMiddleware;
