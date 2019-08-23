const express = require('express');

const router = express.Router();
const ImageController = require('../controllers/image');

// Get all images
router.get('/', ImageController.getAllImages);

// Get image with the given id
router.get('/:id', ImageController.getImage);

// Get image file
router.get('/:id/file', ImageController.getImageFile);

// Create image
router.post('/', ImageController.uploadImage, ImageController.createImage);

// Update image with the given id
router.put('/:id', ImageController.uploadImage, ImageController.updateImage);

// Patch image with the given id
router.patch('/:id', ImageController.patchImage);

// Delete image with the given id
router.delete('/:id', ImageController.deleteImage);

module.exports = router;
