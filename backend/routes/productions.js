const express = require('express');
const router = express.Router();
const ProductionController = require('../controllers/production');

// Get all productions
router.get('/', ProductionController.getProductionsList);

// Get production with the given id
router.get('/:id', ProductionController.getProduction);

// Create production
router.post('/', ProductionController.createProduction);

// Update production with the given id
router.put('/:id', ProductionController.updateProduction);

// Delete production with the given id
router.delete('/:id', ProductionController.deleteProduction);

module.exports = router;