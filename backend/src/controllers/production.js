const Production = require('../models/production');
const productionSchema = require('../schemas/production');

// Get all productions
exports.getAllProductions = (req, res, next) => {
    Production.findAll()
        .then((productions) => {
            res.json(productions);
        })
        .catch(next);
};

// Get production with the given id
exports.getProduction = (req, res, next) => {
    Production.findByPk(req.params.id)
        .then((production) => {
            res.json(production);
        })
        .catch(next);
};

// Create production
exports.createProduction = (req, res, next) => {
    const { title, length, releaseDate, isSerie, genre, description, posterId } = req.body;

    productionSchema.requiredKeys('title').validate({
        title,
        length,
        releaseDate,
        isSerie,
        genre,
        description,
        posterId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Production.create(value)
                .then((production) => {
                    res.status(201).json(production);
                })
                .catch(next);
        }
    });
};

// Update production with the given id
exports.updateProduction = (req, res, next) => {
    const { title, length, releaseDate, isSerie, genre, description, posterId } = req.body;

    productionSchema.requiredKeys('title').validate({
        title,
        length: length || null,
        releaseDate: releaseDate || null,
        isSerie: isSerie || false,
        genre: genre || null,
        description: description || null,
        posterId: posterId || null,
        /*  Nulls are added in case the request body doesn't contain unrequired attributes.
            Without it, those attributes would remain as they are what is inconsistent
            with PUT method specification. */
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Production.update(value, {
                returning: true,
                where: {
                    id: req.params.id,
                },
            })
                .then(([, [production]]) => {
                    res.status(200).json(production);
                })
                .catch(next);
        }
    });
};

// Patch production with the given id
exports.patchProduction = (req, res, next) => {
    const { title, length, releaseDate, isSerie, genre, description, posterId } = req.body;

    productionSchema.validate({
        title,
        length,
        releaseDate,
        isSerie,
        genre,
        description,
        posterId,
    }, (err, value) => {
        if (err) {
            next(err);
        } else {
            Production.update(value, {
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

// Delete production with the given id
exports.deleteProduction = (req, res, next) => {
    Production.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch(next);
};
