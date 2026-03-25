import type { Application } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Container } from 'inversify';
import { UserRepository } from '../repositories/user.repository.js';
import type { User } from '../types/user.type.js';

// Тип пользователя Passport
type PassportUser = User;

// Тип callback верификации
type VerifyDoneCallback = (
  _error: Error | null,
  _user?: PassportUser | false,
  _info?: { message: string } | any,
) => void;

// Тип callback сериализации
type SerializeDoneCallback = (
  _error: Error | null,
  id?: string,
) => void;

// Тип callback десериализации
type DeserializeDoneCallback = (
  _error: Error | null,
  user?: PassportUser | null
) => void;

/**
 * Инициализация и настройка Passport.js
 * @function initializePassportConfig
 * @param {Application} app - Экземпляр Express-приложения.
 * @param {Container} container - Inversify-контейнер, из которого будет извлекаться UserRepository.
 * @returns {void}
 * @throws {Error} Может выбросить ошибку при внутренней обработке.
 */
export const initializePassportConfig = (app: Application, container: Container): void => {
  // Стратегия локальной аутентификации (username + пароль)
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      /**
       * Верификация для LocalStrategy.
       * @async
       * @param {string} username - Имя пользователя из формы.
       * @param {string} password - Пароль из формы.
       * @param {VerifyDoneCallback} done - Callback для завершения процесса.
       * @returns {Promise<void>}
       */
      async (username: string, password: string, done: VerifyDoneCallback) => {
        try {
          // Получения репозитория из контейнера внутри стратегии
          const userRepository = container.get<UserRepository>(UserRepository);

          // Поиск пользователя по username
          const user: PassportUser | null = await userRepository.findByUsername(username);
          if (!user) {
            // Возврат ошибки аутентификации
            return done(null, false, { message: 'Неправильное имя пользователя.' });
          }

          // Проверка пароля через метод, определенный в интерфейсе User
          const isPasswordValid: boolean = await user.comparePassword(password);
          if (!isPasswordValid) {
            // Возврат ошибки аутентификации
            return done(null, false, { message: 'Неправильный пароль.' });
          }

          // Возврат аутентифицированного пользователя
          return done(null, user);
        } catch (error: unknown) {
          // Обработка ошибки верификации
          if (error instanceof Error) {
            return done(error, false);
          } else {
            const errorMessage = typeof error === 'string' ? error : 'An unknown error occurred during authentication';
            return done(new Error(errorMessage), false);
          }
        }
      },
    ),
  );

  /**
   * Сериализация пользователя в сессию
   *
   * @param {unknown} user - Объект пользователя (из стратегии).
   * @param {SerializeDoneCallback} done - Callback для завершения сериализации.
   * @returns {void}
   */
  passport.serializeUser((user: unknown, done: SerializeDoneCallback) => {
    if (typeof user === 'object' && user !== null && '_id' in user && typeof user._id === 'string') {
      // Сохранение _id (строку) в сессии
      done(null, user._id);
    } else {
      // Ошибка, если объект пользователя некорректен
      done(new Error('Invalid user object for serialization'), undefined);
    }
  });

  /**
   * Десериализация пользователя из сессии
   *
   * @async
   * @param {string} id - ID пользователя из сессии.
   * @param {DeserializeDoneCallback} done - Callback для завершения десериализации.
   * @returns {Promise<void>}
   */
  passport.deserializeUser(async (id: string, done: DeserializeDoneCallback) => {
    try {
      // Получение репозитория из контейнера внутри deserializeUser
      const userRepository = container.get<UserRepository>(UserRepository);

      // Поиск пользователя по ID
      const user: PassportUser | null = await userRepository.findById(id);
      if (!user) {
         console.warn(`User with ID ${id} not found in database during session deserialization.`);
      }
      done(null, user);
    } catch (error: unknown) {
      // Обработка ошибки десериализации
      if (error instanceof Error) {
        done(error, null);
      } else {
        const errorMessage = typeof error === 'string' ? error : 'An unknown error occurred during session deserialization';
        done(new Error(errorMessage), null);
      }
    }
  });

  // Применение middleware
  app.use(passport.initialize());
  app.use(passport.session());
};