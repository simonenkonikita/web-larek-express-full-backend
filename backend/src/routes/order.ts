import express from 'express';
import createOrderValidation from '../validations/orderValidation';
import { createOrder, getOrders, getOrderByID } from '../controllers/order';
import auth from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderByID);
router.post('/', auth, createOrderValidation, createOrder);

export default router;
