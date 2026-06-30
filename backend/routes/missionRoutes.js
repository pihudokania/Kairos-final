const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
  getMissions,
  getMission,
  createMission,
  updateMission,
  deleteMission
} = require('../controllers/missionController');

// Small inline validation-result handler so we don't need a separate file
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
}

const createValidators = [
  body('name').trim().notEmpty().withMessage('Mission name is required').isLength({ max: 200 }),
  body('priority').optional().isIn(['critical', 'high', 'medium', 'low']),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date')
];

const updateValidators = [
  body('progress').optional().isFloat({ min: 0, max: 100 }),
  body('status').optional().isIn(['planning', 'pending', 'in-progress', 'accomplished']),
  body('priority').optional().isIn(['critical', 'high', 'medium', 'low'])
];

router.route('/').get(getMissions).post(createValidators, validate, createMission);

router
  .route('/:id')
  .get(getMission)
  .put(updateValidators, validate, updateMission)
  .delete(deleteMission);

module.exports = router;
