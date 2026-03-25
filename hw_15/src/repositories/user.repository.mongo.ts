import { injectable } from 'inversify';
import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.js';
import type { User, CreateUserDto } from '../types/user.type.js';

// интерфейс для Mongoose-документа пользователя
interface UserDocument extends Document {
  username: string;
  password: string;
  email?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// тип для модели Mongoose
type UserModelType = mongoose.Model<UserDocument>;

// схема Mongoose, используя тип UserDocument
const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: false },
});

// Middleware Mongoose 'pre save': хеширование пароля
userSchema.pre<UserDocument>('save', async function () {
  // Проверка изменения пароля
  if (!this.isModified('password')) {
    return;
  }

  // Хеширование пароля
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Метод экземпляра схемы: проверка пароля
userSchema.methods.comparePassword = async function (this: UserDocument, candidatePassword: string): Promise<boolean> {
  // Сравнение паролей
  return await bcrypt.compare(candidatePassword, this.password);
};

// Создание Mongoose-модели, привязывая к ней тип UserDocument
const UserModel: UserModelType = mongoose.model<UserDocument>('user', userSchema);

/**
 * Реализация репозитория пользователей, использующая MongoDB через Mongoose.
 * Наследует контракт из абстрактного класса UserRepository.
 */
@injectable()
export class UserMongoRepository extends UserRepository {
  /**
   * Поиск пользователя по ID в базе данных.
   * @async
   * @function findById
   * @param {string} id - Уникальный идентификатор пользователя.
   * @returns {Promise<User | null>} Найденный пользователь или null.
   */
  async findById(id: string): Promise<User | null> {
    // Проверка валидности строки ID
    if (!Types.ObjectId.isValid(id)) {
      console.warn('Invalid user ID format for findById:', id);
      return null;
    }

    try {
      // Поиск документа по ID
      const userDoc: UserDocument | null = await UserModel.findById(id).exec();
      if (!userDoc) return null;

      // Преобразование Mongoose-документа в plain object
      const userPlain = userDoc.toObject();

      // Возврат объекта, совместимого с интерфейсом User
      return {
        ...userPlain,
        _id: userPlain._id.toString(),
        comparePassword: userDoc.comparePassword.bind(userDoc),
      } as User;
    } catch (error) {
      console.error('Error in UserMongoRepository.findById:', error);
      // Проброс ошибки
      throw error;
    }
  }

  /**
   * Поиск пользователя по имени пользователя (username) в базе данных.
   * @async
   * @function findByUsername
   * @param {string} username - Имя пользователя.
   * @returns {Promise<User | null>} Найденный пользователь или null.
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      // Поиск документа по username
      const userDoc: UserDocument | null = await UserModel.findOne({ username }).exec();
      if (!userDoc) return null;

      // Преобразование Mongoose-документа в plain object
      const userPlain = userDoc.toObject();

      // Возврат объекта, совместимого с интерфейсом User
      return {
        ...userPlain,
        _id: userPlain._id.toString(),
        comparePassword: userDoc.comparePassword.bind(userDoc),
      } as User;
    } catch (error) {
      console.error('Error in UserMongoRepository.findByUsername:', error);
      // Проброс ошибки
      throw error;
    }
  }

  /**
   * Создание нового пользователя в базе данных.
   * @async
   * @function create
   * @param {CreateUserDto} userData - Данные для создания пользователя.
   * @returns {Promise<User>} Созданный пользователь.
   */
  async create(userData: CreateUserDto): Promise<User> {
    try {
      // Создание Mongoose-документа
      const newUserDoc: UserDocument = new UserModel(userData);
      // Сохранение в базу
      const savedUserDoc: UserDocument = await newUserDoc.save();
      // Преобразование в plain object
      const savedUserPlain = savedUserDoc.toObject();

      // Возврат объекта, совместимого с интерфейсом User
      return {
        ...savedUserPlain,
        _id: savedUserPlain._id.toString(),
        comparePassword: savedUserDoc.comparePassword.bind(savedUserDoc),
      } as User;
    } catch (error) {
      console.error('Error in UserMongoRepository.create:', error);
      // Проброс ошибки
      throw error;
    }
  }
}