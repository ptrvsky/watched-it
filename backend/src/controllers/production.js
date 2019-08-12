const Production = require('../models/production');
const ProductionPerson = require('../models/productionPerson');
const Image = require('../models/image');
const productionSchema = require('../schemas/production');

// Get all productions
exports.getProductionsList = (req, res) => {
    Production.findAll()
        .then(productions => {
            res.json(productions);
        })
        .catch(err => console.log(err));
};

// Get production with the given id
exports.getProduction = (req, res) => {
    Production.findByPk(req.params.id)
        .then(production => {
            res.json(production);
        })
        .catch(err => console.log(err));
};

// Create production
exports.createProduction = (req, res) => {
    let { title, length, releaseDate, isSerie, genre, description } = req.body;
  
    productionSchema.requiredKeys('title').validate({
        title: title,
        length: length,
        releaseDate: releaseDate,
        isSerie: isSerie,
        genre: genre,
        description: description
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Production.create(value)
                .then(production => {
                    console.log(`Production ${value.title} has been added to the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Update production with the given id
exports.updateProduction = (req, res) => {
    let { title, length, releaseDate, isSerie, genre, description } = req.body;

    productionSchema.validate({
        title: title,
        length: length,
        releaseDate: releaseDate,
        isSerie: isSerie,
        genre: genre,
        description: description
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Production.update(value, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(production => {
                    console.log(`Production with id: ${req.params.id} has been updated in the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Delete production with the given id
exports.deleteProduction = (req, res) => {
    Production.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(production => {
            console.log(`Production with id: ${req.params.id} has been removed from the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};

// Get list of the selected production assignments 
exports.getListOfProductionPeople = (req, res) => {
    ProductionPerson.findAll({
            where: {
                productionId: req.params.productionId
            }
        })
        .then(productionsPeople => {
            res.json(productionsPeople);
        })
        .catch(err => console.log(err));
};

// Get list of the selected production assignments 
exports.getListOfProductionImages = (req, res) => {
    Image.findAll({
            where: {
                productionId: req.params.productionId
            }
        })
        .then(productionsPeople => {
            res.json(productionsPeople);
        })
        .catch(err => console.log(err));
};