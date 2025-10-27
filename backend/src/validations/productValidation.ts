import { celebrate, Joi, Segments } from 'celebrate';

export const createProductValidation = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
  }),
}, {
  abortEarly: false,
});

export const updateProductValidation = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(30).optional(),
    category: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    image: Joi.object({
      fileName: Joi.string().optional(),
      originalName: Joi.string().optional(),
    }).optional(),
  }),
}, {
  abortEarly: false,
});

export const productIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});
