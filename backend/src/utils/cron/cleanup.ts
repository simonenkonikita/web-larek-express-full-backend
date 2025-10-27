import cron from 'node-cron';
import cleanupOldTempFiles from '../cleanup';
import { logger } from '../../middlewares/logger';

cron.schedule('0 */6 * * *', async () => {
  logger.log('Запуск очистки временных файлов...');
  await cleanupOldTempFiles(6);
  logger.info('Очистка временных файлов завершена');
});

export default cron;
