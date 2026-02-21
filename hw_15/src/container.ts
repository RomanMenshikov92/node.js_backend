import { Container } from 'inversify';
import BooksRepository from './repositories/books.repository.js';
import BooksRepositoryMongo from './repositories/books.repository.mongo.js';

/**
 * IoC-контейнер приложения.
 * Управляет зависимостями и их жизненным циклом.
 */
const ContainerDefault: Container = new Container();

// Регистрация зависимости
ContainerDefault.bind(BooksRepository).to(BooksRepositoryMongo);

export { ContainerDefault };