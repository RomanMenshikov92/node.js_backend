import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Путь к файлу для хранения счётчиков
const DATA_FILE_PATH = path.join(__dirname, 'data', 'counts.json');

// Убедимся, что папка data существует
await fs.ensureDir(path.dirname(DATA_FILE_PATH));

// Функция для загрузки счётчиков из файла
const loadCounts = async () => {
    try {
        if (await fs.pathExists(DATA_FILE_PATH)) {
            const data = await fs.readJson(DATA_FILE_PATH);
            return data;
        }
    } catch (err) {
        console.error('[COUNTER-SERVICE] Error reading counts file:', err.message);
    }
    return {};
};

// Функция для сохранения счётчиков в файл
const saveCounts = async (counts) => {
    try {
        await fs.writeJson(DATA_FILE_PATH, counts, { spaces: 2 });
        console.log('[COUNTER-SERVICE] Counts saved to file.');
    } catch (err) {
        console.error('[COUNTER-SERVICE] Error saving counts file:', err.message);
    }
};

// Инициализируем данные при запуске
let counts = await loadCounts();

// Middleware для парсинга JSON
app.use(express.json());

// Маршрут: увеличить счётчик для книги
app.post('/counter/:bookId/incr', async (req, res) => {
    const bookId = req.params.bookId;

    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    counts[bookId] = (counts[bookId] || 0) + 1;

    try {
        await saveCounts(counts);
        res.status(200).json({ bookId, count: counts[bookId] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save count' });
    }
});

// Маршрут: получить счётчик для книги
app.get('/counter/:bookId', async (req, res) => {
    const bookId = req.params.bookId;

    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    const count = counts[bookId] || 0;
    res.status(200).json({ bookId, count });
});

// Catch-all для 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`[COUNTER-SERVICE] Server running on port ${PORT}`);
    console.log(`[COUNTER-SERVICE] Data file path: ${DATA_FILE_PATH}`);
});