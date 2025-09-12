import { body, validationResult } from 'express-validator';

// Email validation rules
export const validateEmail = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
];

// Phone validation rules
export const validatePhone = [
  body('phone')
    .isMobilePhone('any')
    .withMessage('Enter a valid phone number'),
];

// OTP validation rules
export const validateOtp = [
  body('otp')
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP must be between 4 and 6 digits'),
];

// Middleware to check validation result
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
