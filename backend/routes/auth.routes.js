const express = require('express');
const {
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  register,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  loginSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  registerSchema,
} = require('../schemas/auth.schema');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(profileUpdateSchema), updateProfile);
router.put('/change-password', protect, validate(passwordChangeSchema), changePassword);
router.post('/logout', protect, logout);

module.exports = router;
