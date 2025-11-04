import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Mongoose-схема для документа пользователя.
 * Определяет структуру и типы данных для коллекции 'users'.
 * Включает логику хеширования пароля перед сохранением.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Будет храниться как хеш
  email: { type: String, required: false }, // Опциональное поле
});

/**
 * Middleware Mongoose 'pre save'.
 * Автоматически хеширует пароль, если он был изменён перед сохранением документа.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Метод экземпляра схемы для проверки введённого пароля.
 * Сравнивает предоставленный пароль с хешем, хранящимся в документе.
 *
 * @param {string} candidatePassword - Пароль, введённый пользователем.
 * @returns {Promise<boolean>} - Возвращает true, если пароли совпадают, иначе false.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Mongoose-модель для взаимодействия с коллекцией 'users'.
 * Предоставляет методы для CRUD операций с документами пользователей.
 * @type {mongoose.Model}
 */
const User = mongoose.model("user", userSchema);

export default User;
