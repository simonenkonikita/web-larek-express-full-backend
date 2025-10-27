import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../middlewares/logger';
import { BadRequestError, InternalServerError, NotFoundError } from '../errors/index';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;

    if (!file) {
      return next(new BadRequestError('Файл не был загружен'));
    }

    return res.json({
      fileName: `/temp/${file.filename}`,
      originalName: file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export const moveFileToPermanentLocation = async (
  tempFileName: string,
  permanentDir: string,
): Promise<string> => {
  try {
    const tempPath = path.join('uploads/temp', tempFileName);
    const permanentPath = path.join('uploads', permanentDir, tempFileName);

    await fs.mkdir(path.dirname(permanentPath), { recursive: true });

    try {
      await fs.access(tempPath);
    } catch {
      throw new NotFoundError(`Временный файл не найден: ${tempFileName}`);
    }

    await fs.rename(tempPath, permanentPath);

    return `/temp/${permanentDir}/${tempFileName}`;
  } catch (_error) {
    throw new InternalServerError('Ошибка перемещения файла');
  }
};

export const cleanupTempFile = async (fileName: string): Promise<void> => {
  try {
    const filePath = path.join('uploads/temp', fileName);
    await fs.unlink(filePath);
  } catch (error) {
    logger.error(`Не удалось удалить временный файл: ${fileName}`, error);
  }
};
