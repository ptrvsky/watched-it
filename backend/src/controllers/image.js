const Image = require('../models/image');
const ImagePerson = require('../models/imagePerson');
const imageSchema = require('../schemas/image');
const upload = require('../config/upload');
const Op = require('sequelize').Op;

// Get all images
exports.getAllImages = (req, res) => {
    Image.findAll()
        .then(images => {
            res.json(images);
        })
        .catch(err => console.log(err));
};

// Get image with the given id
exports.getImage = (req, res) => {
    Image.findByPk(req.params.id)
        .then(image => {
            res.json(image);
        })
        .catch(err => console.log(err));
};

// Get images assigned to selected production
exports.getImagesByProduction = (req, res) => {
    Image.findAll({
            where: {
                productionId: req.params.productionId
            }
        }).then(images => {
            res.json(images);
        })
        .catch(err => console.log(err));
};

// Get images assigned to selected person
exports.getImagesByPerson = (req, res) => {
    ImagePerson.findAll({
            where: {
                personId: req.params.personId,
            }
        })
        .then(imagePersonAssignments =>
            imagePersonAssignments.map(value => value.dataValues.imageId)
        )
        .then(imagesIds => Image.findAll({
            where: {
                id: {
                    [Op.or]: imagesIds
                }
            }
        })).then(images => {
            res.json(images);
        })
        .catch(err => console.log(err));
};

// Create image
exports.createImage = (req, res) => {
    imageSchema.requiredKeys('url', 'productionId').validate({
        url: req.file.path.replace("\\","/"),
        productionId: req.body.productionId
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Image.create(value)
                .then(image => {
                    console.log(`Image with url: ${value.url} has been added to the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Update image with the given id
exports.updateImage = (req, res) => {
    imageSchema.validate({
        productionId: req.body.productionId
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Image.update(value, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(image => {
                    console.log(`Image with id: ${req.params.id} has been updated in the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Delete image with the given id
exports.deleteImage = (req, res) => {
    Image.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(image => {
            console.log(`Image with id: ${req.params.id} has been removed from the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};

// Upload image file
exports.uploadImage = (req, res, next) => {
    upload(req, res, next, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            next();
        }
    })
};

// Get image file
exports.getImageFile = (req, res) => {
    Image.findByPk(req.params.id)
        .then(image => {
            res.redirect("http://localhost:" + process.env.PORT + "/" + image.url);
        })
        .catch(err => console.log(err));
}
