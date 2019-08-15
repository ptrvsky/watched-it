const express = require('express');
const router = express.Router();
const ImagePersonController = require('../controllers/imagePerson');

// Get all image-person assignments
router.get('/', ImagePersonController.getAllImagePersonAssignments);

// Get image-person assignment with the given id
router.get('/:id', ImagePersonController.getImagePersonAssignment);

// Create image-person assignment
router.post('/', ImagePersonController.createImagePersonAssignment);

// Update image-person assignment with the given id
router.put('/:id', ImagePersonController.updateImagePersonAssignment);

// Patch image-person assignment with the given id
router.patch('/:id', ImagePersonController.patchImagePersonAssignment);

// Delete image-person assignemtn with the given id
router.delete('/:id', ImagePersonController.deleteImagePersonAssignment);

module.exports = router;