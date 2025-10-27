import { Request, Response, NextFunction } from 'express';
import path from 'path';
import Product from '../models/product';
import { cleanupTempFile, moveFileToPermanentLocation } from './upload';
import { IProduct } from '../types/product';
import handleMongooseError from '../utils/handleMongooseError';
import {
  BadRequestError,
  ConflictError,
  statusCode,
} from '../errors/index';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});

    return res.status(statusCode.OK).json({
      success: true,
      total: products.length,
      items: products,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const getProductByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID продукта не верный'));
    }

    const products = await Product.findById(id);

    if (!products) {
      return next(new ConflictError('Продукт не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      products,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, ...productData }: IProduct = req.body;

    const existingProduct = await Product.findOne({ title: productData.title });

    if (existingProduct) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    let finalImagePath = null;
    let tempFileName = null;
    let permanentPath = null;

    if (image && typeof image === 'object' && image.fileName) {
      tempFileName = path.basename(image.fileName);

      permanentPath = await moveFileToPermanentLocation(
        tempFileName,
        'products',
      );

      finalImagePath = {
        fileName: permanentPath,
        originalName: image.originalName,
      };
    }

    const product = await Product.create({
      ...productData,
      image: finalImagePath,
    });

    if (tempFileName) {
      await cleanupTempFile(tempFileName);
    }

    return res.status(statusCode.CREATED).json({
      product,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const updatedProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID продукта не верный'));
    }

    const updateData = req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateProduct) {
      return next(new ConflictError('Продукт для обновления не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      product: updateProduct,
      message: 'Продукт успешно обновлен',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const removalProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID продукта не верный'));
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new ConflictError('Продукт не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      product: deletedProduct,
      message: 'Продукт успешно удален',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};
