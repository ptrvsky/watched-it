const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/person');
const ProductionPersonController = require('../controllers/productionPerson');
const ImageController = require('../controllers/image');

// Get all people
router.get('/', PersonController.getAllPeople);

// Get person with the given id
router.get('/:id', PersonController.getPerson);

// Create person
router.post('/', PersonController.createPerson);

// Update production with the given id
router.put('/:id', PersonController.updatePerson);

// Delete production with the given id
router.delete('/:id', PersonController.deletePerson);

// Get list of the selected person assignments 
router.get('/:personId/productions', ProductionPersonController.getProductionPersonAssignmentsByPerson);

// Get assignments between production and person with given ids
router.get('/:personId/productions/:productionId', ProductionPersonController.getProductionPersonAssignmentsByIds);

// Get images assisnged to the person
router.get('/:personId/images', ImageController.getImagesByPerson);

module.exports = router;