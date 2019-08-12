const express = require('express');
const router = express.Router();
const ProductionController = require('../controllers/production');
const ProductionPersonController = require('../controllers/productionPerson');
const ImageController = require('../controllers/image');

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

// Get list of the selected production assignments 
router.get('/:productionId/people', ProductionController.getListOfProductionPeople);

// Get assignments between production and person with given ids
router.get('/:productionId/people/:personId', ProductionPersonController.getProductionPersonAssignmentsByIds);

// Get images assigned to the production
router.get('/:productionId/images', ImageController.getImagesByProduction);

module.exports = router;