const express = require('express');

const router = express.Router();
const PersonRateController = require('../controllers/personRate');

// Get all rates
router.get('/', PersonRateController.getAllRates);

// Get rate with given personId and userId
router.get('/people/:personId/users/:userId', PersonRateController.getRate);

// Create rate
router.post('/', PersonRateController.createRate);

// Update rate
router.put('/', PersonRateController.updateRate);

// Delete rate with given personId and userId
router.delete('/people/:personId/users/:userId', PersonRateController.deleteRate);

module.exports = router;
