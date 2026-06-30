const express = require('express');
const router = express.Router();
const { getStats, nudgeMomentum, updateStats } = require('../controllers/statsController');

router.get('/', getStats);
router.put('/', updateStats);
router.patch('/momentum', nudgeMomentum);

module.exports = router;
