const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  phone: Joi.string().allow('', null).pattern(/^[0-9+\-\s()]*$/).messages({
    'string.pattern.base': 'Phone number format is invalid',
  }),
  avatar: Joi.string().allow('', null),
});

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirmation password is required',
  }),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('Super Admin', 'Employee').required().messages({
    'any.only': 'Role must be either Super Admin or Employee',
    'any.required': 'Role selection is required',
  }),
  department: Joi.string().allow('', null),
  designation: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  employeeCode: Joi.string().required().messages({
    'string.empty': 'Employee code is required',
    'any.required': 'Employee code is required',
  }),
});

module.exports = {
  loginSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  registerSchema,
};
