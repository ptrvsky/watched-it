const express = require('express');
const router = express.Router();
const Person = require('../models/person');

// Get all people
router.get('/', (req, res) => {
    Person.findAll()
        .then(people => {
            res.json(people);
        })
        .catch(err => console.log(err));
});

// Get person with the given id
router.get('/:id', (req, res) => {
    Person.findByPk(req.params.id)
        .then(person => {
            res.json(person);
        })
        .catch(err => console.log(err));
});

// Add person
router.post('/', (req, res) => {
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
});

// Update production
router.put('/:id', (req, res) => {
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
});

// Delete production
router.delete('/:id', (req, res) => {
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
});

module.exports = router;