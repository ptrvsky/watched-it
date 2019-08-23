const ImagePerson = require('../models/imagePerson');
const imagePersonSchema = require('../schemas/imagePerson');

// Get list of all image-person assignments
exports.getAllImagePersonAssignments = (req, res, next) => {
    ImagePerson.findAll()
        .then((imagePersonAssignments) => {
            res.json(imagePersonAssignments);
        })
        .catch(next);
};

// Get image-person assignment with given assignment id
exports.getImagePersonAssignment = (req, res, next) => {
    ImagePerson.findByPk(req.params.id)
        .then((imagePersonAssignment) => {
            res.json(imagePersonAssignment);
        })
        .catch(next);
};

// Create image-person assignment
exports.createImagePersonAssignment = (req, res, next) => {
    const { imageId, personId } = req.body;

    imagePersonSchema.requiredKeys('imageId', 'personId').validate({
        imageId,
        personId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            ImagePerson.create(value)
                .then((imagePersonAssignment) => {
                    res.status(201).json(imagePersonAssignment);
                })
                .catch(next);
        }
    });
};

// Update image-person assignment
exports.updateImagePersonAssignment = (req, res, next) => {
    const { imageId, personId } = req.body;

    imagePersonSchema.requiredKeys('imageId', 'personId').validate({
        imageId,
        personId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            ImagePerson.update(value, {
                returning: true,
                where: {
                    id: req.params.id,
                },
            })
                .then(([, [imagePersonAssignment]]) => {
                    res.status(200).json(imagePersonAssignment);
                })
                .catch(next);
        }
    });
};

// Patch image-person assignment
exports.patchImagePersonAssignment = (req, res, next) => {
    const { imageId, personId } = req.body;

    imagePersonSchema.validate({
        imageId,
        personId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            ImagePerson.update(value, {
                where: {
                    id: req.params.id,
                },
            })
                .then(() => {
                    res.status(204).end();
                })
                .catch(next);
        }
    });
};

// Delete image-person assignment
exports.deleteImagePersonAssignment = (req, res, next) => {
    ImagePerson.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch(next);
};
