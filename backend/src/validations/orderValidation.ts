import { celebrate, Joi, Segments } from 'celebrate';

const createOrderValidation = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^(\+7|8)?[1-9]\d{10}$/).required(),
    address: Joi.string().min(5).required(),
    items: Joi.array().items(Joi.string().hex().length(24).required()).min(1).required(),
    total: Joi.number().min(0).required(),
  }),
}, {
  abortEarly: false,
});

export default createOrderValidation;
