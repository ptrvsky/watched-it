const Production = require('../models/production');

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
    let { title, length, releaseDate, isSerie } = req.body;

    Production.create({
            title,
            length,
            releaseDate,
            isSerie
        })
        .then(production => {
            console.log(`Production ${title} has been added to the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};

// Update production with the given id
exports.updateProduction = (req, res) => {
    let { title, length, releaseDate, isSerie } = req.body;

    Production.update({
            title,
            length,
            releaseDate,
            isSerie,
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(production => {
            console.log(`Production with id: ${req.params.id} has been updated in the database.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
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