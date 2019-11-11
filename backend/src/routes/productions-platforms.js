const express = require('express');

const router = express.Router();
const ProductionPlatformController = require('../controllers/productionPlatform');

// Get all production-platform assignments
router.get('/', ProductionPlatformController.getAllProductionPlatformAssignments);

// Get production-platform assignment with given productionId and platformId
router.get('/productions/:productionId/platforms/:platformId', ProductionPlatformController.getProductionPlatformAssignment);

// Create production-platform assignment
router.post('/', ProductionPlatformController.createProductionPlatformAssignment);

// Delete production-platform assignment with given productionId and platformId
router.delete('/productions/:productionId/platforms/:platformId', ProductionPlatformController.deleteProductionPlatformAssignment);

module.exports = router;
