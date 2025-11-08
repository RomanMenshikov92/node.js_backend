/**
 * Обработчик события DOMContentLoaded для инициализации функционала комментариев на странице книги.
 * Подключается к серверу через Socket.IO, загружает начальные комментарии с сервера,
 * обрабатывает отправку новых комментариев и отображает их в реальном времени.
 */
document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const commentText = document.getElementById("comment-text");
  const bookIdInput = document.getElementById("book-id");
  const usernameInput = document.getElementById("username");

  if (!commentForm || !bookIdInput) {
    console.warn("Форма комментариев или ID книги не найдены.");
    return;
  }

  const bookId = bookIdInput.value;
  const username = usernameInput ? usernameInput.value : "Аноним";

  const socket = io();
  socket.emit("joinBookRoom", bookId);

  const initialCommentsDataElement = document.getElementById("initial-comments-data");
  let initialComments = [];
  if (initialCommentsDataElement) {
    try {
      const jsonString = initialCommentsDataElement.getAttribute("data-comments").replace(/&quot;/g, '"');
      initialComments = JSON.parse(jsonString);
    } catch (e) {
      console.error("Ошибка парсинга initialComments:", e);
    }
  }

  if (Array.isArray(initialComments)) {
    initialComments.forEach((comment) => {
      addCommentToDOM(comment);
    });
  }

  socket.on("loadComments", (comments) => {
    commentsList.innerHTML = "";
    comments.forEach(addCommentToDOM);
  });

  socket.on("newCommentReceived", (comment) => {
    addCommentToDOM(comment);
  });

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = commentText.value.trim();
    if (text) {
      socket.emit("newComment", { bookId, text, username });
      commentText.value = "";
    }
  });

  /**
   * Добавляет комментарий в DOM список комментариев.
   * Проверяет, не добавлен ли уже комментарий с таким _id.
   * @param {Object} comment - Объект комментария, содержащий _id, username, text, timestamp.
   *                           _id может отсутствовать для временных комментариев при отправке.
   */
  function addCommentToDOM(comment) {
    if (comment._id && document.querySelector(`[data-comment-id="${comment._id}"]`)) {
      return;
    }

    const commentElement = document.createElement("div");
    commentElement.setAttribute("data-comment-id", comment._id || `temp-${Date.now()}`);
    commentElement.className = "comment-item";
    commentElement.innerHTML = `
      <p><strong>${comment.username}</strong> <em>(${new Date(comment.timestamp).toLocaleString()})</em></p>
      <p>${comment.text}</p>
    `;
    commentsList.appendChild(commentElement);
  }
});
