import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const errors: ValidationError[] = [];
  const { email, password, firstName, lastName, phone, role, address } = req.body;

  // Email validation
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be less than 50 characters' });
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be less than 50 characters' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  } else if (password.length > 128) {
    errors.push({ field: 'password', message: 'Password must be less than 128 characters' });
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must include uppercase, lowercase, and numeric characters',
    });
  }

  // Optional phone number validation
  if (phone) {
    const trimmedPhone = String(phone).replace(/\s+/g, '');
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Align with frontend E.164 style validation

    if (!phoneRegex.test(trimmedPhone)) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
    }
  } else {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }

  const allowedRoles = ['RENTER', 'OWNER', 'ADMIN'];
  if (!role) {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!allowedRoles.includes(role.toString().trim().toUpperCase())) {
    errors.push({ field: 'role', message: 'Invalid role selected' });
  }

  const addressData = address ?? {};
  if (!addressData || typeof addressData !== 'object') {
    errors.push({ field: 'address', message: 'Address information is required' });
  } else {
    const requiredAddressFields = ['country', 'city', 'state', 'postalCode'];
    requiredAddressFields.forEach((field) => {
      if (!addressData[field] || String(addressData[field]).trim().length === 0) {
        errors.push({ field: `address.${field}`, message: `${field} is required` });
      }
    });
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
