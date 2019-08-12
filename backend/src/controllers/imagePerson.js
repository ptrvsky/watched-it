const ImagePerson = require('../models/imagePerson');
const imagePersonSchema = require('../schemas/imagePerson');

// Get list of all image-person assignments 
exports.getAllImagePersonAssignments = (req, res) => {
    ImagePerson.findAll()
        .then(imagePersonAssignments => {
            res.json(imagePersonAssignments);
        })
        .catch(err => console.log(err));
};

// Get image-person assignment with given assignment id
exports.getImagePersonAssignment = (req, res) => {
    ImagePerson.findByPk(req.params.id)
        .then(imagePersonAssignment => {
            res.json(imagePersonAssignment);
        })
        .catch(err => console.log(err));
};

// Create image-person assignment
exports.createImagePersonAssignment = (req, res) => {
    let { imageId, personId} = req.body;

    imagePersonSchema.requiredKeys('imageId', 'personId').validate({
        imageId: imageId,
        personId: personId
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            ImagePerson.create(value)
                .then(imagePersonAssignment => {
                    console.log(`Person with id: ${personId} has been assigned to the image with id: ${personId}.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Update image-person assignment
exports.updateImagePersonAssignment = (req, res) => {
    let { imageId, personId} = req.body;

    imagePersonSchema.validate({
        imageId: imageId,
        personId: personId
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
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
                .catch(err => console.log(err));
        }
    });
};

// Delete image-person assignment
exports.deleteImagePersonAssignment = (req, res) => {
    ImagePerson.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(imagePersonAssignment => {
            console.log(`Image-person assignment with id: ${req.params.id} has been deleted.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};