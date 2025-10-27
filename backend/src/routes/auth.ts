import express from 'express';
import {
  login, register, refreshTokens, logout,
} from '../controllers/auth';
import auth from '../middlewares/auth';
import { createUserValidation, loginValidation } from '../validations/userValidation';

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/register', createUserValidation, register);
router.get('/token', auth, refreshTokens);
router.get('/logout', auth, logout);

export default router;
