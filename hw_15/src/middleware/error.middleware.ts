import type { Request, Response, NextFunction } from 'express';

/**
 * Обработка всех ошибок
 *
 * - Если ошибка имеет статус 404 (Not Found), рендерит страницу 404.
 * - Для остальных ошибок (500 и выше) логирует стек и показывает страницу ошибки.
 * - Всегда отвечает HTML-страницей при веб-запросах.
 * - Для API-запросов возвращает JSON с ошибкой.
 * @function errorMiddleware
 * @param {Error} err - Объект ошибки
 * @param {Request} req - Объект запроса Express
 * @param {Response} res - Объект ответа Express
 * @param {NextFunction} next - Функция перехода к следующему middleware (обязательна в сигнатуре)
 * @returns {void}
 */
const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Логирование ошибки
  console.error("[ERROR]", err.stack || err.toString());

  // Стандартный статус для ошибок
  let statusCode: number = 500;

  // Проверка на наличие свойства status или statusCode у объекта ошибки
  if (typeof err === 'object' && err !== null) {
    const errorWithStatus = err as unknown as Record<string, unknown>;
    if (typeof errorWithStatus.status === 'number') {
      statusCode = errorWithStatus.status;
    } else if (typeof errorWithStatus.statusCode === 'number') {
      statusCode = errorWithStatus.statusCode;
    }
  }

  // Проверка, ожидает ли клиент HTML
  if (req.accepts("html")) {
    // Обработка 404 ошибки
    if (statusCode === 404) {
      return res.status(404).render("error/404", { title: "Страница не найдена" });
    }
    // Обработка прочих ошибок (500+)
    return res.status(statusCode).render("error/404", {
      title: "Ошибка сервера",
      message: "Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.",
    });
  }

  // Ответ JSON для API-запросов
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
    },
  });
};

export default errorMiddleware;