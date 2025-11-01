import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const errors: ValidationError[] = [];
  const { email, password, firstName, lastName, phone } = req.body;

  // Email validation
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  } else if (password.length > 128) {
    errors.push({ field: 'password', message: 'Password must be less than 128 characters' });
  }

  // Optional phone number validation
  if (phone) {
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
    } else if (phone.length < 7 || phone.length > 15) {
      errors.push({ field: 'phone', message: 'Phone number must be between 7 and 15 characters' });
    }
  }

  // Optional name validation
  if (firstName && firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be less than 50 characters' });
  }

  if (lastName && lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be less than 50 characters' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const errors: ValidationError[] = [];
  const { email, password } = req.body;

  // Email validation
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
}
