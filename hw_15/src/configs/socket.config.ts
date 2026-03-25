import { Server as SocketIOServer, Socket } from 'socket.io';
import { Container } from 'inversify';
import { CommentRepository } from '../repositories/comment.repository.js';
import type { CreateCommentDto } from '../types/comment.type.js';
import type { Comment } from '../types/comment.type.js';

/**
 * Инициализация Socket.IO
 * @function initializeSocketIO
 * @param {SocketIOServer} io - Экземпляр Socket.IO сервера.
 * @param {Container} container - Inversify-контейнер, из которого будет извлекаться CommentRepository.
 * @returns {void}
 */
export const initializeSocketIO = (io: SocketIOServer, container: Container): void => {
  // Обработка подключения нового сокета
  io.on('connection', (socket: Socket) => {
    console.log('Пользователь подключился к Socket.IO:', socket.id);

    // Обработка события присоединения к комнате книги
    socket.on('joinBookRoom', async (bookId: string) => {
      // Проверка типа bookId
      if (typeof bookId !== 'string') {
          console.warn('Неверный bookId для joinBookRoom:', bookId);
          return;
      }
      socket.join(bookId);
      try {
        // Получение репозитория из контейнера
        const commentRepo = container.get<CommentRepository>(CommentRepository);
        // Вызов метода репозитория
        const comments = await commentRepo.findByBookId(bookId);
        // Отправка результата клиенту
        socket.emit('loadComments', comments);
      } catch (error) {
        console.error('Ошибка загрузки комментариев из базы:', error);
        // Отправка пустого массива в случае ошибки
        socket.emit('loadComments', []);
      }
    });

    // Обработка события получения нового комментария
    socket.on('newComment', async (data: { bookId: string; text: string; username: string }) => {

      // Проверка структуры и типы данных
      if (!data || typeof data.bookId !== 'string' || typeof data.text !== 'string' || typeof data.username !== 'string') {
          console.warn('Неверные данные для newComment:', data);
          socket.emit('commentError', { message: 'Неверный формат данных комментария.' });
          return;
      }

      // Извлечение данных комментария
      const { bookId, text, username } = data;

      // Проверка обязательных полей
      if (!bookId || !text || !username) {
          console.warn('Отсутствуют обязательные поля для newComment:', { bookId, text, username });
          socket.emit('commentError', { message: 'Все поля комментария обязательны.' });
          return;
      }

      try {
        // Получение репозитория из контейнера
        const commentRepo = container.get<CommentRepository>(CommentRepository);

        // Подготовка DTO для создания комментария
        const newCommentData: CreateCommentDto = { bookId, text, username };

        // Вызов метода репозитория для создания комментария
        const newComment: Comment = await commentRepo.create(newCommentData);

        // Рассылка созданного комментария всем в комнате bookId
        io.to(bookId).emit('newCommentReceived', newComment);
      } catch (error) {
        console.error('Ошибка сохранения комментария в базу:', error);
        // Отправка ошибки конкретному клиенту, который отправил комментарий
        socket.emit('commentError', { message: 'Не удалось сохранить комментарий.' });
      }
    });

    // Обработка отключения сокета
    socket.on('disconnect', () => {
      console.log('Пользователь отключился от Socket.IO:', socket.id);
    });
  });
};