const Person = require('../models/person');
const ProductionPerson = require('../models/productionPerson');

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

    Person.create({
            name,
            dob,
            dod,
            birthplace
        })
        .then(person => {
            console.log(`Person ${name} has been added to the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};

// Update person with the given id
exports.updatePerson = (req, res) => {
    let { name, dob, dod, birthplace } = req.body;

    Person.update({
            name,
            dob,
            dod,
            birthplace
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(person => {
            console.log(`Person with id: ${req.params.id} has been updated in the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
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
exports.getListOfPersonAssignments = (req, res) => {
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