import type { Comment, CreateCommentDto } from '../types/comment.type.js';

/**
 * Абстрактный класс репозитория для работы с комментариями.
 * Определяет контракт для всех реализаций репозитория.
 */
export abstract class CommentRepository {
  /**
   * Получение комментариев по ID книги.
   * @param {string} bookId - Уникальный идентификатор книги.
   * @returns {Promise<Comment[]>} Массив комментариев для указанной книги.
   */
  abstract findByBookId(bookId: string): Promise<Comment[]>;

  /**
   * Создание нового комментария.
   * @param {CreateCommentDto} commentData - Данные для создания комментария.
   * @returns {Promise<Comment>} Созданный комментарий.
   */
  abstract create(commentData: CreateCommentDto): Promise<Comment>;
}