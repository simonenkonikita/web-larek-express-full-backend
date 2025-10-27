import mongoose from 'mongoose';

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  items: mongoose.Types.ObjectId[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}
