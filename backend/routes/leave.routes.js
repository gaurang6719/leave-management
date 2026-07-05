const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updatePendingLeave,
  cancelPendingLeave,
  approveRejectLeave,
  getLeaveStats,
} = require('../controllers/leave.controller');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  leaveApplySchema,
  leaveApprovalSchema,
} = require('../schemas/leave.schema');

const router = express.Router();

router.use(protect);

// Stats route accessed by both roles (role-based split internally)
router.get('/stats', getLeaveStats);

// Employee-only routes
router.get('/my-leaves', authorize('Employee'), getMyLeaves);
router.post('/', authorize('Employee'), validate(leaveApplySchema), applyLeave);
router.put('/:id', authorize('Employee'), validate(leaveApplySchema), updatePendingLeave);
router.post('/:id/cancel', authorize('Employee'), cancelPendingLeave);

// Admin-only routes
router.get('/', authorize('Super Admin'), getAllLeaves);
router.post('/:id/approve-reject', authorize('Super Admin'), validate(leaveApprovalSchema), approveRejectLeave);

module.exports = router;
