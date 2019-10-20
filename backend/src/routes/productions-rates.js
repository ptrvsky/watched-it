const express = require('express');

const router = express.Router();
const ProductionRateController = require('../controllers/productionRate');

// Get all rates
router.get('/', ProductionRateController.getAllRates);

// Get rate with given productionId and userId
router.get('/productions/:productionId/users/:userId', ProductionRateController.getRate);

// Create rate
router.post('/', ProductionRateController.createRate);

// Update rate
router.put('/', ProductionRateController.updateRate);

// Delete rate with given productionId and userId
router.delete('/productions/:productionId/users/:userId', ProductionRateController.deleteRate);

module.exports = router;
