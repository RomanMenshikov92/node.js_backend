// интерфейс "пользователь"
export interface User {
  readonly _id: string;
  readonly username: string;
  readonly password: string;
  readonly email?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// интерфейс создания пользователя
export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
}