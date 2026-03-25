// интерфейс "комментарий"
export interface Comment {
  readonly _id: string;
  readonly bookId: string; // ObjectId в виде строки
  readonly text: string;
  readonly username: string;
  readonly timestamp: Date;
}

// интерфейс создания комментария
export interface CreateCommentDto {
  bookId: string;
  text: string;
  username: string;
}