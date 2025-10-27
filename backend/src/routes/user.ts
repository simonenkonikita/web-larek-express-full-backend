import express from 'express';
import {
  getCurrentUser, getUsers, removalUser, updatedUser,
} from '../controllers/user';
import auth from '../middlewares/auth';
import { userIdValidation, updateUserValidation } from '../validations/userValidation';

const router = express.Router();

router.get('/user', auth, getCurrentUser);
router.get('/users', getUsers);
router.patch('/user/:id', auth, userIdValidation, updateUserValidation, updatedUser);
router.delete('/user/:id', auth, userIdValidation, removalUser);

export default router;
