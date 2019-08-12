const Person = require('../models/person');
const ProductionPerson = require('../models/productionPerson');
const personSchema = require('../schemas/person');

// Get all productions
exports.getPeopleList = (req, res) => {
    Person.findAll()
        .then(people => {
            res.json(people);
        })
        .catch(err => console.log(err));
};

// Get person with the given id
exports.getPerson = (req, res) => {
    Person.findByPk(req.params.id)
        .then(person => {
            res.json(person);
        })
        .catch(err => console.log(err));
};

// Add person
exports.createPerson = (req, res) => {
    let { name, dob, dod, birthplace } = req.body;

    personSchema.requiredKeys('name').validate({
        name: name,
        dob: dob,
        dod: dod,
        birthplace: birthplace
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            Person.create(value)
                .then(person => {
                    console.log(`Person ${value.name} has been added to the database.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err))
        }
    });
};

// Update person with the given id
exports.updatePerson = (req, res) => {
    let { name, dob, dod, birthplace } = req.body;

    personSchema.validate({
        name: name,
        dob: dob,
        dod: dod,
        birthplace: birthplace
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
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
                .catch(err => console.log(err));
        }
    });
};

// Delete person with the given id
exports.deletePerson = (req, res) => {
    Person.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(person => {
            console.log(`Person with id: ${req.params.id} has been removed from the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};

// Get list of the selected person assignments 
exports.getListOfPersonProductions = (req, res) => {
    ProductionPerson.findAll({
            where: {
                personId: req.params.personId
            }
        })
        .then(productionsPeople => {
            res.json(productionsPeople);
        })
        .catch(err => console.log(err));
};