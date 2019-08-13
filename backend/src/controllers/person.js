const Person = require('../models/person');
const Production = require('../models/production');
const ProductionPerson = require('../models/productionPerson');
const personSchema = require('../schemas/person');
const Op = require('sequelize').Op;

// Get all productions
exports.getAllPeople = (req, res, next) => {
    Person.findAll()
        .then(people => {
            res.json(people);
        })
        .catch(next);
};

// Get person with the given id
exports.getPerson = (req, res, next) => {
    Person.findByPk(req.params.id)
        .then(person => {
            res.json(person);
        })
        .catch(next);
};

// Add person
exports.createPerson = (req, res, next) => {
    let { name, dob, dod, birthplace } = req.body;

    personSchema.requiredKeys('name').validate({
        name: name,
        dob: dob,
        dod: dod,
        birthplace: birthplace
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Person.create(value)
                .then(person => {
                    console.log(`Person ${value.name} has been added to the database.`);
                    res.status(200).end();
                })
                .catch(next)
        }
    });
};

// Update person with the given id
exports.updatePerson = (req, res, next) => {
    let { name, dob, dod, birthplace } = req.body;

    personSchema.validate({
        name: name,
        dob: dob,
        dod: dod,
        birthplace: birthplace
    }, (err, value) => {
        if (err) {
            next(err)
        } else {
            Person.update(value, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(person => {
                    console.log(`Person with id: ${req.params.id} has been updated in the database.`);
                    res.status(200).end();
                })
                .catch(next);
        }
    });
};

// Delete person with the given id
exports.deletePerson = (req, res, next) => {
    Person.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(person => {
            console.log(`Person with id: ${req.params.id} has been removed from the database.`);
            res.status(200).end();
        })
        .catch(next);
};
