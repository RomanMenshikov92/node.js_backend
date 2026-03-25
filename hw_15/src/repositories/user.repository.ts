import type { User, CreateUserDto } from '../types/user.type.js';

/**
 * Абстрактный класс репозитория для работы с пользователями.
 * Определяет контракт для всех реализаций репозитория.
 */
export abstract class UserRepository {
  /**
   * Поиск пользователя по ID.
   * @param {string} id - Уникальный идентификатор пользователя.
   * @returns {Promise<User | null>} Найденный пользователь или null.
   */
  abstract findById(id: string): Promise<User | null>;

  /**
   * Поиск пользователя по имени пользователя (username).
   * @param {string} username - Имя пользователя.
   * @returns {Promise<User | null>} Найденный пользователь или null.
   */
  abstract findByUsername(username: string): Promise<User | null>;

  /**
   * Создание нового пользователя.
   * @param {CreateUserDto} userData - Данные для создания пользователя.
   * @returns {Promise<User>} Созданный пользователь.
   */
  abstract create(userData: CreateUserDto): Promise<User>;
}