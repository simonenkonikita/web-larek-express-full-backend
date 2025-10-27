import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Order from '../models/order';
import { IOrder } from '../types/order';
import handleMongooseError from '../utils/handleMongooseError';
import {
  BadRequestError,
  ConflictError,
  statusCode,
} from '../errors/index';

export const getOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({}).populate('items', 'title price category').exec();

    const calculatedTotal = orders.reduce((sum, product) => sum + (product.total || 0), 0);

    return res.status(statusCode.OK).json({
      success: true,
      total: orders.length,
      totalSum: calculatedTotal,
      orders,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID заказа не верный'));
    }

    const order = await Order.findById(id)
      .populate('items', 'title price category')
      .exec();

    if (!order) {
      return next(new BadRequestError('Заказ не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items, ...оrderData }: IOrder = req.body;

  try {
    const products = await Product.find({
      _id: { $in: items },
      price: { $ne: null },
    });

    if (products.length !== items.length) {
      const foundIds = products.map((product) => product._id.toString());
      const missingItems = items.filter((id) => !foundIds.includes(id.toString()));

      return next(new BadRequestError(`Товары не найдены: ${missingItems.join(', ')}`));
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);

    if (calculatedTotal !== total) {
      return next(new BadRequestError(`Неверная сумма заказа. Ожидалось: ${calculatedTotal}, получено: ${total}`));
    }

    const order = await Order.create({
      ...оrderData,
      items,
      total: calculatedTotal,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items', 'title price category')
      .exec();

    return res.status(statusCode.OK).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const updatedOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID заказа не верный'));
    }

    const updateData = req.body;

    const updateOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateOrder) {
      return next(new ConflictError('Заказ для обновления не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      order: updateOrder,
      message: 'Заказ успешно обновлен',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const removalOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID заказа не верный'));
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return next(new ConflictError('Заказ не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      order: deletedOrder,
      message: 'Заказ успешно удален',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};
