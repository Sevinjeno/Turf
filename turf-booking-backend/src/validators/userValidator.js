import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    action: Joi.string().optional(),   
    // password: Joi.string().min(6).required(),
});