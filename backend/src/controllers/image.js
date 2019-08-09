const Image = require('../models/image');
const imageSchema = require('../schemas/image')

// Get all images
exports.getImagesList = (req, res) => {
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

// Create image
exports.createImage = (req, res) => {
    let { url, productionId } = req.body;

    imageSchema.requiredKeys('url', 'productionId').validate({
        url: url,
        productionId: productionId
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Image.create(value)
                .then(image => {
                    console.log(`Image with url: ${value.url} has been added to the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err))
        }
    });
};

// Update image with the given id
exports.updateImage = (req, res) => {
    let { url, productionId } = req.body;

    imageSchema.validate({
        url: url,
        productionId: productionId
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

