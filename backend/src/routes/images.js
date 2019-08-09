const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/image');

// Get all images
router.get('/', ImageController.getImagesList);

// Get image with the given id
router.get('/:id', ImageController.getImage);

// Create image
router.post('/', ImageController.createImage);

// Update image with the given id
router.put('/:id', ImageController.updateImage);

// Delete image with the given id
router.delete('/:id', ImageController.deleteImage);

module.exports = router;