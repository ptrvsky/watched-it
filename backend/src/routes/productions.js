const express = require('express');

const router = express.Router();
const ProductionController = require('../controllers/production');
const ProductionPersonController = require('../controllers/productionPerson');
const ImageController = require('../controllers/image');
const ProductionRateController = require('../controllers/productionRate');

// Get all productions
router.get('/', ProductionController.getAllProductions);

// Get production with the given id
router.get('/:id', ProductionController.getProduction);

// Create production
router.post('/', ProductionController.createProduction);

// Update production with the given id
router.put('/:id', ProductionController.updateProduction);

// Patch production with the given id
router.patch('/:id', ProductionController.patchProduction);

// Delete production with the given id
router.delete('/:id', ProductionController.deleteProduction);

// Get list of the selected production assignments
router.get('/:productionId/people', ProductionPersonController.getProductionPersonAssignmentsByProduction);

// Get assignments between production and person with given ids
router.get('/:productionId/people/:personId', ProductionPersonController.getProductionPersonAssignmentsByIds);

// Get images assigned to the production
router.get('/:productionId/images', ImageController.getImagesByProduction);

// Get rates assigned to the production
router.get('/:productionId/rates', ProductionRateController.getRatesByProduction);

// Get rating stats (average rating, rates quantity) for selected production
router.get('/:productionId/rates/stats', ProductionRateController.getProductionRatingStats);

module.exports = router;
