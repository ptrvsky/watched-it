const { Op } = require('sequelize');
const Image = require('../models/image');
const ImagePerson = require('../models/imagePerson');
const imageSchema = require('../schemas/image');
const upload = require('../config/upload');

// Get all images
exports.getAllImages = (req, res, next) => {
    Image.findAll()
        .then((images) => {
            res.json(images);
        })
        .catch(next);
};

// Get image with the given id
exports.getImage = (req, res, next) => {
    Image.findByPk(req.params.id)
        .then((image) => {
            res.json(image);
        })
        .catch(next);
};

// Get images assigned to selected production
exports.getImagesByProduction = (req, res, next) => {
    Image.findAll({
        where: {
            productionId: req.params.productionId,
        },
    }).then((images) => {
        res.json(images);
    })
        .catch(next);
};

// Get images assigned to selected person
exports.getImagesByPerson = (req, res, next) => {
    ImagePerson.findAll({
        where: {
            personId: req.params.personId,
        },
    })
        .then((imagePersonAssignments) => {
            imagePersonAssignments.map((value) => value.dataValues.imageId);
        })
        .then((imagesIds) => Image.findAll({
            where: {
                id: {
                    [Op.or]: imagesIds,
                },
            },
        })).then((images) => {
            res.json(images);
        })
        .catch(next);
};

// Create image
exports.createImage = (req, res, next) => {
    imageSchema.requiredKeys('url', 'productionId').validate({
        url: req.file.path.replace('\\', '/'),
        productionId: req.body.productionId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Image.create(value)
                .then((image) => {
                    res.status(201).json(image);
                })
                .catch(next);
        }
    });
};

// Update image with the given id
exports.updateImage = (req, res, next) => {
    imageSchema.requiredKeys('url', 'productionId').validate({
        url: req.file.path.replace('\\', '/'),
        productionId: req.body.productionId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Image.update(value, {
                returning: true,
                where: {
                    id: req.params.id,
                },
            })
                .then(([, [image]]) => {
                    res.status(200).json(image);
                })
                .catch(next);
        }
    });
};

// Patch image with the given id
exports.patchImage = (req, res, next) => {
    imageSchema.validate({
        productionId: req.body.productionId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Image.update(value, {
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

// Delete image with the given id
exports.deleteImage = (req, res, next) => {
    Image.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch(next);
};

// Upload image file
exports.uploadImage = (req, res, next) => {
    upload(req, res, next, (err) => {
        if (err) {
            /* If there is argument passed to the next() function, Express regards
            the current request as error and skip non-error handling routing and middleware. */
            next(err);
        } else {
            next();
        }
    });
};

// Get image file
exports.getImageFile = (req, res, next) => {
    Image.findByPk(req.params.id)
        .then((image) => {
            res.redirect(`http://localhost:${process.env.PORT}/${image.url}`);
        })
        .catch(next);
};
