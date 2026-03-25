import { Container } from 'inversify';
import BooksRepository from './repositories/books.repository.js';
import BooksRepositoryMongo from './repositories/books.repository.mongo.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserMongoRepository } from './repositories/user.repository.mongo.js';
import { CommentRepository } from './repositories/comment.repository.js';
import { CommentMongoRepository } from './repositories/comment.repository.mongo.js';

/**
 * IoC-контейнер приложения.
 * Управляет зависимостями и их жизненным циклом.
 */
const ContainerDefault: Container = new Container();

// Регистрация зависимости
ContainerDefault.bind(BooksRepository).to(BooksRepositoryMongo);
ContainerDefault.bind(UserRepository).to(UserMongoRepository);
ContainerDefault.bind(CommentRepository).to(CommentMongoRepository);

export { ContainerDefault };