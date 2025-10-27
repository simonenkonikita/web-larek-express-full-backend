import fs from 'fs/promises';
import path from 'path';
import { logger } from '../middlewares/logger';

const cleanupOldTempFiles = async (maxAgeHours: number = 24): Promise<void> => {
  try {
    const tempDir = path.join(__dirname, '../uploads/temp');

    try {
      await fs.access(tempDir);
    } catch {
      return;
    }

    const files = await fs.readdir(tempDir);
    const now = Date.now();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    await Promise.all(files.map(async (file) => {
      const filePath = path.join(tempDir, file);

      try {
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs >= maxAgeMs) {
          await fs.unlink(filePath);
          logger.info(`Удален старый временный файл: ${file}`);
        }
      } catch (error) {
        logger.error(`Ошибка при обработке файла ${file}:`, error);
      }
    }));
  } catch (error) {
    logger.error('Ошибка при очистке временных файлов:', error);
  }
};
export default cleanupOldTempFiles;
