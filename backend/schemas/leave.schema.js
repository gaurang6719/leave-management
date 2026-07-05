const Joi = require('joi');

const leaveApplySchema = Joi.object({
  leaveType: Joi.string().valid('Casual', 'Sick', 'Paid', 'Emergency', 'Work From Home').required().messages({
    'any.only': 'Leave type must be Casual, Sick, Paid, Emergency, or Work From Home',
    'any.required': 'Leave type is required',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.min': 'End date cannot be before start date',
    'any.required': 'End date is required',
  }),
  days: Joi.number().min(0.5).required().messages({
    'number.min': 'Days must be at least 0.5',
    'any.required': 'Number of days is required',
  }),
  reason: Joi.string().min(5).max(500).required().messages({
    'string.empty': 'Reason is required',
    'string.min': 'Reason must be at least 5 characters',
    'string.max': 'Reason cannot exceed 500 characters',
    'any.required': 'Reason is required',
  }),
});

const leaveApprovalSchema = Joi.object({
  status: Joi.string().valid('Approved', 'Rejected').required().messages({
    'any.only': 'Status must be Approved or Rejected',
    'any.required': 'Status is required',
  }),
  adminRemark: Joi.string().max(250).allow('', null).messages({
    'string.max': 'Admin remark cannot exceed 250 characters',
  }),
});

module.exports = {
  leaveApplySchema,
  leaveApprovalSchema,
};
