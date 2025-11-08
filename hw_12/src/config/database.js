import mongoose from 'mongoose';

/**
 * Асинхронная функция для подключения к базе данных MongoDB
 * @async
 * @function connectDB
 * @returns {Promise<void>} Промис, который разрешается при успешном подключении или отклоняется при ошибке
 * @throws {Error} Выбрасывает ошибку и завершает процесс в случае неудачного подключения
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;