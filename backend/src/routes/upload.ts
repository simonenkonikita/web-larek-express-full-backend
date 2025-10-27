import express from 'express';
import { uploadFile } from '../controllers/upload';
import fileMiddleware from '../middlewares/upload';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/img', auth, fileMiddleware.single('file'), uploadFile);

export default router;
