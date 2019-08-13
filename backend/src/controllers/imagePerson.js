const ImagePerson = require('../models/imagePerson');
const imagePersonSchema = require('../schemas/imagePerson');

// Get list of all image-person assignments 
exports.getAllImagePersonAssignments = (req, res, next) => {
    ImagePerson.findAll()
        .then(imagePersonAssignments => {
            res.json(imagePersonAssignments);
        })
        .catch(next);
};

// Get image-person assignment with given assignment id
exports.getImagePersonAssignment = (req, res, next) => {
    ImagePerson.findByPk(req.params.id)
        .then(imagePersonAssignment => {
            res.json(imagePersonAssignment);
        })
        .catch(next);
};

// Create image-person assignment
exports.createImagePersonAssignment = (req, res, next) => {
    let { imageId, personId} = req.body;

    imagePersonSchema.requiredKeys('imageId', 'personId').validate({
        imageId: imageId,
        personId: personId
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            ImagePerson.create(value)
                .then(imagePersonAssignment => {
                    console.log(`Person with id: ${personId} has been assigned to the image with id: ${personId}.`);
                    res.status(200).end();
                })
                .catch(next);
        }
    });
};

// Update image-person assignment
exports.updateImagePersonAssignment = (req, res, next) => {
    let { imageId, personId} = req.body;

    imagePersonSchema.validate({
        imageId: imageId,
        personId: personId
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            ImagePerson.update(value, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(imagePersonAssignment => {
                    console.log(`Image-person assignment with id: ${req.params.id} has been updated.`);
                    res.status(200).end();
                })
                .catch(next);
        }
    });
};

// Delete image-person assignment
exports.deleteImagePersonAssignment = (req, res, next) => {
    ImagePerson.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(imagePersonAssignment => {
            console.log(`Image-person assignment with id: ${req.params.id} has been deleted.`);
            res.status(200).end();
        })
        .catch(next);
};