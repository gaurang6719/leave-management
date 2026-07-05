const express = require('express');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  employeeCreateSchema,
  employeeUpdateSchema,
} = require('../schemas/user.schema');

const router = express.Router();

// All routes here are restricted to Super Admin only
router.use(protect);
router.use(authorize('Super Admin'));

router.route('/')
  .get(getEmployees)
  .post(validate(employeeCreateSchema), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(validate(employeeUpdateSchema), updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
