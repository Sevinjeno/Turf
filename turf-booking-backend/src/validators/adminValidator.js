import Joi from 'joi';

export const adminValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    // password: Joi.string().pattern(/^[0-9]{10}$/).required(),
});
