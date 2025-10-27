import mongoose from 'mongoose';
import { IUser } from '../types/user';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  tokens: [{
    type: String,
    select: false,
  }],
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model<IUser>('user', userSchema, 'user');
