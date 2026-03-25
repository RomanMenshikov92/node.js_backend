import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Container } from 'inversify';
import { UserRepository } from '../repositories/user.repository.js';
import type { CreateUserDto } from '../types/user.type.js';

/**
 * Отображение страницы входа.
 *
 * @function getLoginPage
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getLoginPage = (req: Request, res: Response): void => {
  // Проверка аутентификации
  if (req.isAuthenticated()) {
    return res.redirect('/api/user/me');
  }
  // Получение ошибки из сессии или query
  const errorMessage = req.query.error || (req.session as any)?.messages?.pop();
  // Рендеринг страницы входа с ошибкой и пользователем
  res.render('auth/login', { error: errorMessage, user: req.user });
};

/**
 * Отображение страницы регистрации.
 *
 * @function getSignupPage
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getSignupPage = (req: Request, res: Response): void => {
  // Проверка аутентификации
  if (req.isAuthenticated()) {
    return res.redirect('/api/user/me');
  }
  // Рендеринг страницы регистрации с пользователем
  res.render('auth/signup', { user: req.user });
};

/**
 * Обработка POST-запроса на вход.
 *
 * @function postLogin
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @param {NextFunction} next - Функция перехода к следующему middleware.
 * @returns {void}
 */
export const postLogin = (req: Request, res: Response, next: NextFunction): void => {
  // Аутентификация через Passport
  passport.authenticate('local', (err: Error | null, user: any, info: { message: string }) => {
    if (err) {
      console.error('Ошибка аутентификации:', err);
      return next(err);
    }
    if (!user) {
      // Перенаправление при неудачной аутентификации
      return res.redirect('/api/user/login?error=' + encodeURIComponent(info.message));
    }
    // Вход пользователя в систему
    req.logIn(user, (err) => {
      if (err) {
        console.error('Ошибка входа:', err);
        return next(err);
      }
      // Перенаправление после успешного входа
      return res.redirect('/api/user/me');
    });
  })(req, res, next);
};

/**
 * Обработка POST-запроса на регистрацию.
 *
 * @async
 * @function postSignup
 * @param {Container} container - IoC-контейнер для получения зависимостей.
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @returns {Promise<void>}
 */
export const postSignup = async (container: Container, req: Request, res: Response): Promise<void> => {
  // Извлечение данных из тела запроса
  const { username, password, email } = req.body;
  // Проверка обязательных полей
  if (!username || !password) {
    return res.status(400).render('auth/signup', { error: 'Имя пользователя и пароль обязательны.' });
  }

  try {
    // Получение репозитория из контейнера
    const userRepository = container.get<UserRepository>(UserRepository);

    // Проверка уникальности имени пользователя
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      return res.status(400).render('auth/signup', { error: 'Пользователь с таким именем уже существует.' });
    }

    // Подготовка DTO для создания пользователя
    const newUserDto: CreateUserDto = { username, password, email };
    // Создание пользователя через репозиторий
    const newUser = await userRepository.create(newUserDto);

    // Вход нового пользователя в систему
    req.logIn(newUser, (err) => {
      if (err) {
        console.error('Ошибка входа после регистрации:', err);
        return res.redirect('/api/user/login?error=' + encodeURIComponent('Ошибка при входе после регистрации.'));
      }
      // Перенаправление после успешной регистрации и входа
      return res.redirect('/api/user/me');
    });
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return res.status(400).render('auth/signup', { error: message });
    }
    res.status(500).render('error/404', { title: 'Ошибка сервера', message: 'Не удалось зарегистрировать пользователя.', user: req.user });
  }
};

/**
 * Отображение страницы профиля пользователя.
 *
 * @function getProfile
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getProfile = (req: Request, res: Response): void => {
  // Проверка аутентификации
  if (!req.isAuthenticated()) {
    return res.redirect('/api/user/login');
  }
  // Рендеринг страницы профиля с пользователем
  res.render('auth/profile', { user: req.user });
};

/**
 * Обработка выхода пользователя из системы.
 *
 * @function logout
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @returns {void}
 */
export const logout = (req: Request, res: Response): void => {
  // Выход пользователя
  req.logout((err) => {
    if (err) {
      console.error('Ошибка выхода:', err);
      return res.redirect('/');
    }
    // Уничтожение сессии
    (req.session as any)?.destroy((err: any) => {
      if (err) {
        console.error('Ошибка уничтожения сессии:', err);
      }
    });
    res.redirect('/');
  });
};