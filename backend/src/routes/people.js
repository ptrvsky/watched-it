const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/person');
const ProductionPersonController = require('../controllers/productionPerson');

// Get all people
router.get('/', PersonController.getPeopleList);

// Get person with the given id
router.get('/:id', PersonController.getPerson);

// Create person
router.post('/', PersonController.createPerson);

// Update production with the given id
router.put('/:id', PersonController.updatePerson);

// Delete production with the given id
router.delete('/:id', PersonController.deletePerson);

// Get list of the selected person assignments 
router.get('/:personId/productions', PersonController.getListOfPersonAssignments);

// Get assignments betweent production and person with given ids
router.get('/:personId/productions/:productionId', ProductionPersonController.getProductionPersonAssignments);

module.exports = router;