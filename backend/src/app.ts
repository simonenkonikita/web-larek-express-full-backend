import './types/express';
import './utils/cron/cleanup';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import uploadRouter from './routes/upload';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger, logger } from './middlewares/logger';

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);
app.use('/auth', userRouter);
app.use('/upload', uploadRouter);

app.use(errors());

app.use(errorLogger);

app.use(errorHandler);

async function startServer() {
  try {
    const { PORT = 3001, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;
    if (!DB_ADDRESS) throw new Error('DB_ADDRESS is required');
    if (!PORT) throw new Error('PORT is required');

    await mongoose.connect(DB_ADDRESS);
    logger.info('Connected to MongoDB');

    app.listen(PORT, () => {
      logger.info(`Сервер запущен на порте ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
