// Сущность книги для приложения «Библиотека».
export interface Book {
  readonly title: string;
  readonly description: string | null;
  readonly authors: string | null;
  readonly favorite?: boolean;
  readonly fileCover?: string | null;
  readonly fileName?: string | null;
  readonly fileBook?: string | null;
  readonly viewCount?: number;
}