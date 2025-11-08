import { Server } from "socket.io";
import Comment from "../models/comment.js";
import { incrementViewCount } from "../models/bookModel.js";

/**
 * Инициализирует и настраивает Socket.IO для переданного HTTP-сервера.
 * Обрабатывает подключения, присоединение к комнатам книг, загрузку и отправку комментариев в реальном времени.
 * Комментарии загружаются и сохраняются в базе данных через модель Comment.
 *
 * @param {import('http').Server} httpServer - HTTP-сервер, созданный Express.
 * @returns {import('socket.io').Server} Экземпляр Socket.IO сервера.
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Пользователь подключился к Socket.IO:", socket.id);

    /**
     * Обработчик события 'joinBookRoom'.
     * Позволяет пользователю присоединиться к комнате, соответствующей конкретной книге (bookId).
     * При присоединении загружает все комментарии для этой книги из базы данных и отправляет их клиенту.
     *
     * @param {string} bookId - ID книги, к комнате которой присоединяется клиент.
     */
    socket.on("joinBookRoom", async (bookId) => {
      socket.join(bookId);
      try {
        const comments = await Comment.find({ bookId: bookId }).sort({ timestamp: 1 }).lean();
        socket.emit("loadComments", comments);
      } catch (error) {
        console.error("Ошибка загрузки комментариев из базы:", error);
        socket.emit("loadComments", []);
      }
    });

    /**
     * Обработчик события 'newComment'.
     * Принимает данные нового комментария от клиента, проверяет их,
     * сохраняет комментарий в базу данных и рассылает его всем клиентам в комнате книги.
     *
     * @param {Object} data - Объект, содержащий данные комментария.
     * @param {string} data.bookId - ID книги, к которой относится комментарий.
     * @param {string} data.text - Текст комментария.
     * @param {string} data.username - Имя пользователя, оставившего комментарий.
     */
    socket.on("newComment", async (data) => {
      const { bookId, text, username } = data;
      if (bookId && text && username) {
        try {
          const newComment = new Comment({ bookId, text, username });
          const savedComment = await newComment.save();
          io.to(bookId).emit("newCommentReceived", savedComment);
        } catch (error) {
          console.error("Ошибка сохранения комментария в базу:", error);
          socket.emit("commentError", { message: "Не удалось сохранить комментарий." });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Пользователь отключился от Socket.IO:", socket.id);
    });
  });

  return io;
};

export { initializeSocket, incrementViewCount };
