import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * @description Создаём папку uploads, если она не существует
 * @type {string}
 */
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * @description Конфигурация хранилища для multer: куда и как сохранять файлы
 * @type {import('multer').StorageEngine}
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `book-${uniqueSuffix}${ext}`);
  }
});

/**
 * @description Фильтр разрешённых типов файлов для загрузки книг
 * @param {Object} req - HTTP-запрос
 * @param {Object} file - Информация о загружаемом файле
 * @param {Function} cb - Callback для принятия/отклонения файла
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.epub', '.mobi', '.txt', '.fb2'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .epub, .mobi, .txt, .fb2 files allowed!'), false);
  }
};

/**
 * @description Middleware для загрузки файла книги
 * @description Используется с upload.single('fileBook') в роутах
 * @description Поддерживает файлы до 50 МБ в форматах: PDF, EPUB, MOBI, TXT, FB2
 * @type {import('multer').Multer}
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload;