const Joi = require('joi');

const employeeCreateSchema = Joi.object({
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
  role: Joi.string().valid('Super Admin', 'Employee').default('Employee').messages({
    'any.only': 'Role must be either Super Admin or Employee',
  }),
  department: Joi.string().allow('', null),
  designation: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  employeeCode: Joi.string().required().messages({
    'string.empty': 'Employee code is required',
    'any.required': 'Employee code is required',
  }),
  leaveBalances: Joi.object({
    Casual: Joi.number().min(0).max(100).default(12),
    Sick: Joi.number().min(0).max(100).default(12),
    Paid: Joi.number().min(0).max(100).default(12),
    Emergency: Joi.number().min(0).max(100).default(12),
    WFH: Joi.number().min(0).max(100).default(12),
  }).default({ Casual: 12, Sick: 12, Paid: 12, Emergency: 12, WFH: 12 }),
});

const employeeUpdateSchema = Joi.object({
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
  role: Joi.string().valid('Super Admin', 'Employee').required().messages({
    'any.only': 'Role must be either Super Admin or Employee',
    'any.required': 'Role is required',
  }),
  department: Joi.string().allow('', null),
  designation: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  employeeCode: Joi.string().required().messages({
    'string.empty': 'Employee code is required',
    'any.required': 'Employee code is required',
  }),
  leaveBalances: Joi.object({
    Casual: Joi.number().min(0).max(100).default(12),
    Sick: Joi.number().min(0).max(100).default(12),
    Paid: Joi.number().min(0).max(100).default(12),
    Emergency: Joi.number().min(0).max(100).default(12),
    WFH: Joi.number().min(0).max(100).default(12),
  }).default({ Casual: 12, Sick: 12, Paid: 12, Emergency: 12, WFH: 12 }),
});

module.exports = {
  employeeCreateSchema,
  employeeUpdateSchema,
};
