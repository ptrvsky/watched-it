const Production = require('../models/production');
const Person = require('../models/person');
const ProductionPerson = require('../models/productionPerson');
const Image = require('../models/image');
const productionSchema = require('../schemas/production');
const Op = require('sequelize').Op;

// Get all productions
exports.getAllProductions = (req, res, next) => {
    Production.findAll()
        .then(productions => {
            res.json(productions);
        })
        .catch(next);
};

// Get production with the given id
exports.getProduction = (req, res, next) => {
    Production.findByPk(req.params.id)
        .then(production => {
            res.json(production);
        })
        .catch(next);
};

// Create production
exports.createProduction = (req, res, next) => {
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
            next(err);
        } else {
            Production.create(value)
                .then(production => {
                    console.log(`Production ${value.title} has been added to the database.`);
                    res.status(201).json(production);
                })
                .catch(next);
        }
    });
};

// Update production with the given id
exports.updateProduction = (req, res, next) => {
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
            next(err);
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
                .catch(next);
        }
    });
};

// Delete production with the given id
exports.deleteProduction = (req, res, next) => {
    Production.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(production => {
            console.log(`Production with id: ${req.params.id} has been removed from the database.`);
            res.status(200).end();
        })
        .catch(next);
};
