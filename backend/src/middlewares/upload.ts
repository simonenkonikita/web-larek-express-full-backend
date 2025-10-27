import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs/promises';

const ensureTempDirExists = async () => {
  try {
    await fs.access('uploads/temp');
  } catch {
    await fs.mkdir('uploads/temp', { recursive: true });
  }
};

const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = path.extname(originalName);
  return `${timestamp}_${randomString}${extension}`;
};

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await ensureTempDirExists();
    cb(null, 'uploads/temp/');
  },
  filename: (_req, file, cb) => {
    const uniqueName = generateUniqueFileName(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  /* const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; */
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  /*   const mimetype = allowedMimeTypes.includes(file.mimetype); */

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif, webp)'));
  }
};

const fileMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default fileMiddleware;
