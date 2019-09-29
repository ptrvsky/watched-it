const express = require('express');

const router = express.Router();
const RateController = require('../controllers/rate');

// Get all rates
router.get('/', RateController.getAllRates);

// Get rate with given productionId and userId
router.get('/production/:productionId/user/:userId', RateController.getRate);

// Create rate
router.post('/', RateController.createRate);

// Update rate
router.put('/', RateController.updateRate);

// Delete rate with given productionId and userId
router.delete('/production/:productionId/user/:userId', RateController.deleteRate);

module.exports = router;
