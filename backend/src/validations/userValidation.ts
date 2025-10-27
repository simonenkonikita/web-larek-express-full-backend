import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    /* .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) */
  }),
}, {
  abortEarly: false,
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
  }),
}, {
  abortEarly: false,
});

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}, {
  abortEarly: false,
});

export const userIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().length(24).required(),
  }),
});
