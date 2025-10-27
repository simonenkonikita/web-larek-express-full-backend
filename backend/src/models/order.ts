import mongoose from 'mongoose';
import { IOrder } from '../types/order';

const orderSchema = new mongoose.Schema<IOrder>({
  payment: {
    type: String,
    required: true,
    enum: ['card', 'online'],
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
  },
  phone: {
    type: String,
    required: true,
    match: /^(\+7|8)?[1-9]\d{10}$/,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
    match: /^[0-9a-fA-F]{24}$/,
  }],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model<IOrder>('order', orderSchema, 'order');
