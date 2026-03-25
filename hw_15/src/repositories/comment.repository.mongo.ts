import { injectable } from 'inversify';
import mongoose, { Types } from 'mongoose';
import { CommentRepository } from './comment.repository.js';
import type { Comment, CreateCommentDto } from '../types/comment.type.js';

// Схема Mongoose для комментария
const commentSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Модель Mongoose для взаимодействия с коллекцией 'comments'
const CommentModel = mongoose.model('comment', commentSchema);

/**
 * Реализация репозитория комментариев, использующая MongoDB через Mongoose.
 * Наследует контракт из абстрактного класса CommentRepository.
 */
@injectable()
export class CommentMongoRepository extends CommentRepository {
  /**
   * Получение комментариев по ID книги из базы данных.
   * @async
   * @function findByBookId
   * @param {string} bookId - Уникальный идентификатор книги.
   * @returns {Promise<Comment[]>} Массив комментариев для указанной книги.
   */
  async findByBookId(bookId: string): Promise<Comment[]> {
    // Проверка валидности строки ID
    if (!Types.ObjectId.isValid(bookId)) {
      console.warn('Invalid bookId format for findByBookId:', bookId);
      return [];
    }

    try {
      // Поиск комментариев по bookId, сортировка по timestamp
      const commentsLean = await CommentModel.find({ bookId: new Types.ObjectId(bookId) })
                                            .sort({ timestamp: 1 })
                                            .lean()
                                            .exec();

      // Преобразование ObjectId в строку дляейсу Comment
      return commentsLean.map(comment => ({
        ...comment,
        _id: comment._id.toString(),
        bookId: comment.bookId.toString(),
      })) as Comment[];
    } catch (error) {
      console.error('Error in CommentMongoRepository.findByBookId:', error);
      // Проброс ошибки
      throw error;
    }
  }

  /**
   * Создание нового комментария в базе данных.
   * @async
   * @function create
   * @param {CreateCommentDto} commentData - Данные для создания комментария.
   * @returns {Promise<Comment>} Созданный комментарий.
   */
  async create(commentData: CreateCommentDto): Promise<Comment> {
    // Проверка валидности bookId
    if (!Types.ObjectId.isValid(commentData.bookId)) {
      throw new Error('Invalid bookId format');
    }

    try {
      // Создание Mongoose-документа с преобразованием bookId в ObjectId
      const newCommentDoc = new CommentModel({
        ...commentData,
        bookId: new Types.ObjectId(commentData.bookId),
      });

      // Сохранение документа в базу
      const savedCommentDoc = await newCommentDoc.save();
      // Преобразование сохранённого документа в plain object
      const savedCommentPlain = savedCommentDoc.toObject();

      // Преобразование ObjectId в строку для соответствия интерфейсу Comment
      return {
        ...savedCommentPlain,
        _id: savedCommentPlain._id.toString(),
        bookId: savedCommentPlain.bookId.toString(),
      } as Comment;
    } catch (error) {
      console.error('Error in CommentMongoRepository.create:', error);
      // Проброс ошибки
      throw error;
    }
  }
}