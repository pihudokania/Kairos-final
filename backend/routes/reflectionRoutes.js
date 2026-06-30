const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { getReflections, createReflection } = require('../controllers/reflectionController');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
}

router
  .route('/')
  .get(getReflections)
  .post(body('body').trim().notEmpty().withMessage('Reflection body is required'), validate, createReflection);

module.exports = router;
