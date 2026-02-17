// Интерфейс сущности «Книга» для приложения «Библиотека».
export interface Book {
  title: string;
  description: string | null;
  authors: string | null;
  favorite?: boolean;
  fileCover?: string | null;
  fileName?: string | null;
  fileBook?: string | null;
  viewCount?: number;
}