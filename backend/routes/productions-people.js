const express = require('express');
const router = express.Router();
const ProductionPersonController = require('../controllers/productionPerson');

// Get all production-person assignments
router.get('/', ProductionPersonController.getProductionPersonAssignmentsList);

// Get production-person assignment with the given id
router.get('/:id', ProductionPersonController.getProductionPersonAssignment);

// Create production-person assignment
router.post('/', ProductionPersonController.createProductionPersonAssignment);

// Update production with the given id
router.put('/:id', ProductionPersonController.updateProductionPersonAssignment);

// Delete production with the given id
router.delete('/:id', ProductionPersonController.deleteProductionPersonAssignment);

module.exports = router;