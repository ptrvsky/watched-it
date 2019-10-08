const express = require('express');

const router = express.Router();
const UserProductionController = require('../controllers/userProduction');

// Get user-production assignment with given ids
router.get('/users/:userId/productions/:productionId', UserProductionController.getUserProductionAssignmentByIds);

// Create user-production assignment
router.post('/', UserProductionController.createUserProductionAssignment);

// Delete user-production assignment with given ids
router.delete('/users/:userId/productions/:productionId', UserProductionController.deleteProductionPersonAssignment);

module.exports = router;
