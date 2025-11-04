import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

/**
 * Инициализирует и настраивает Passport.js для приложения.
 * Устанавливает локальную стратегию аутентификации, а также
 * функции сериализации и десериализации пользователя для сессии.
 * Применяет middleware Passport к Express-приложению.
 *
 * @param {import('express').Application} app - Экземпляр Express-приложения.
 * @returns {void}
 */
const initializePassport = (app) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      /**
       * Функция проверки (verify) для LocalStrategy.
       * Ищет пользователя в БД по имени и проверяет пароль.
       *
       * @param {string} username - Имя пользователя, введенное в форме.
       * @param {string} password - Пароль, введенный в форме.
       * @param {function} done - Функция обратного вызова для Passport.
       *                         Вызывается как done(error, user, info).
       *                         - error: объект ошибки, если произошла ошибка на уровне БД и т.п.
       *                         - user: объект пользователя, если аутентификация успешна, иначе false.
       *                         - info: объект с дополнительной информацией (например, сообщением об ошибке).
       * @returns {Promise<void>}
       */
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return done(null, false, { message: "Неправильное имя пользователя." });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: "Неправильный пароль." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * Функция сериализации пользователя для хранения в сессии.
   * Вызывается при успешной аутентификации. Обычно сохраняется только ID.
   *
   * @param {import('mongoose').Document} user - Объект пользователя Mongoose.
   * @param {function} done - Функция обратного вызова для Passport.
   *                         Вызывается как done(error, id).
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /**
   * Функция десериализации пользователя из сессии.
   * Вызывается при каждом запросе, если в сессии есть ID пользователя.
   * Загружает полный объект пользователя из БД по ID.
   *
   * @param {string} id - ID пользователя, сохраненный в сессии.
   * @param {function} done - Функция обратного вызова для Passport.
   *                          Вызывается как done(error, user).
   * @returns {Promise<void>}
   */
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

export default initializePassport;
