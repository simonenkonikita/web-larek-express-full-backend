import mongoose from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  price: number;
  image: IImage;
}
