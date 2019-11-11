const express = require('express');

const router = express.Router();
const PlatformController = require('../controllers/platform');
const ProductionPlatformController = require('../controllers/productionPlatform');

// Get all platform
router.get('/', PlatformController.getAllPlatforms);

// Get platform with the given id
router.get('/:id', PlatformController.getPlatform);

// Create platform
router.post('/', PlatformController.createPlatform);

// Update platform with the given id
router.put('/:id', PlatformController.updatePlatform);

// Patch platform with the given id
router.patch('/:id', PlatformController.patchPlatform);

// Delete platform with the given id
router.delete('/:id', PlatformController.deletePlatform);

// Get productions assigned to the platform
router.get('/:platformId/productions', ProductionPlatformController.getProductionPlatformAssignmentsByPlatform);

module.exports = router;
