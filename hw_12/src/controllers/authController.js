import passport from 'passport';
import User from '../models/user.js';

/**
 * Отображает страницу входа.
 * Если пользователь уже аутентифицирован, перенаправляет на страницу профиля.
 * В противном случае рендерит шаблон 'auth/login', передавая возможную ошибку.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getLoginPage = (req, res) => {
  // Проверяем, не вошёл ли пользователь уже
  if (req.isAuthenticated()) {
    return res.redirect('/api/user/me');
  }
  // Передаем возможную ошибку
  const errorMessage = req.query.error || req.session.messages?.pop(); // Используем query или session
  res.render('auth/login', { error: errorMessage });
};

/**
 * Отображает страницу регистрации.
 * Если пользователь уже аутентифицирован, перенаправляет на страницу профиля.
 * В противном случае рендерит шаблон 'auth/signup'.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getSignupPage = (req, res) => {
  // Проверяем, не вошёл ли пользователь уже
  if (req.isAuthenticated()) {
    return res.redirect('/api/user/me'); // Если да, перенаправляем на профиль
  }
  // Просто рендерим страницу регистрации, передавая req.user для layout
  res.render('auth/signup', { user: req.user });
};

/**
 * Обрабатывает POST-запрос на вход.
 * Использует стратегию 'local' Passport.js для аутентификации.
 * В случае успеха сохраняет пользователя в сессию и перенаправляет на '/api/user/me'.
 * В случае неудачи перенаправляет обратно на '/api/user/login' с сообщением об ошибке.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @param {import('express').NextFunction} next - Функция перехода к следующему middleware.
 * @returns {void}
 */
export const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Ошибка аутентификации:', err);
      return next(err);
    }
    if (!user) {
      // Аутентификация не удалась
      return res.redirect('/api/user/login?error=' + encodeURIComponent(info.message));
    }
    // Аутентификация успешна
    req.logIn(user, (err) => {
      if (err) {
        console.error('Ошибка входа:', err);
        return next(err);
      }
      return res.redirect('/api/user/me');
    });
  })(req, res, next);
};

/**
 * Обрабатывает POST-запрос на регистрацию.
 * Проверяет уникальность имени пользователя, создает нового пользователя,
 * хеширует пароль (через Mongoose hook), сохраняет в БД и автоматически логинит.
 * В случае ошибки рендерит шаблон 'auth/signup' с сообщением об ошибке.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @returns {void}
 */
export const postSignup = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).render('auth/signup', { error: 'Имя пользователя и пароль обязательны.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).render('auth/signup', { error: 'Пользователь с таким именем уже существует.' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    // После регистрации автоматически логиним пользователя
    req.logIn(newUser, (err) => {
      if (err) {
        console.error('Ошибка входа после регистрации:', err);
        return res.redirect('/api/user/login?error=' + encodeURIComponent('Ошибка при входе после регистрации.'));
      }
      return res.redirect('/api/user/me');
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).render('auth/signup', { error: message });
    }
    res.status(500).render('errors/404', { title: 'Ошибка сервера', message: 'Не удалось зарегистрировать пользователя.' });
  }
};

/**
 * Отображает страницу профиля пользователя.
 * Требует аутентификации. Если пользователь не аутентифицирован,
 * перенаправляет на страницу входа.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @returns {void}
 */
export const getProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/api/user/login');
  }
  // req.user - это объект пользователя, загруженный Passport.js из сессии
  res.render('auth/profile', { user: req.user });
};

/**
 * Обрабатывает выход пользователя из системы.
 * Удаляет информацию о пользователе из сессии и уничтожает сессию.
 * Перенаправляет на главную страницу.
 *
 * @param {import('express').Request} req - Объект запроса Express.
 * @param {import('express').Response} res - Объект ответа Express.
 * @returns {void}
 */
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Ошибка выхода:', err);
      return res.redirect('/');
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Ошибка уничтожения сессии:', err);
      }
      res.redirect('/');
    });
  });
};