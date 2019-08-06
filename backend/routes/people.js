const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/person');

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

module.exports = router;