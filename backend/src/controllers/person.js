const Person = require('../models/person');
const personSchema = require('../schemas/person');

// Get all productions
exports.getAllPeople = (req, res, next) => {
    Person.findAll()
        .then((people) => {
            res.json(people);
        })
        .catch(next);
};

// Get person with the given id
exports.getPerson = (req, res, next) => {
    Person.findByPk(req.params.id)
        .then((person) => {
            res.json(person);
        })
        .catch(next);
};

// Add person
exports.createPerson = (req, res, next) => {
    const { name, dob, dod, birthplace } = req.body;

    personSchema.requiredKeys('name').validate({
        name,
        dob,
        dod,
        birthplace,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Person.create(value)
                .then((person) => {
                    res.status(201).json(person);
                })
                .catch(next);
        }
    });
};

// Update person with the given id
exports.updatePerson = (req, res, next) => {
    const { name, dob, dod, birthplace } = req.body;

    personSchema.requiredKeys('name').validate({
        name,
        dob: dob || null,
        dod: dod || null,
        birthplace: birthplace || null,
        /*  Nulls are added in case the request body doesn't contain unrequired attributes.
            Without it, those attributes would remain as they are what is inconsistent
            with PUT method specification. */
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Person.update(value, {
                returning: true,
                where: {
                    id: req.params.id,
                },
            })
                .then(([, [person]]) => {
                    res.status(200).json(person);
                })
                .catch(next);
        }
    });
};

// Patch person with the given id
exports.patchPerson = (req, res, next) => {
    const { name, dob, dod, birthplace } = req.body;

    personSchema.validate({
        name,
        dob,
        dod,
        birthplace,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Person.update(value, {
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

// Delete person with the given id
exports.deletePerson = (req, res, next) => {
    Person.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch(next);
};
