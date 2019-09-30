const Sequelize = require('sequelize');

const Rate = require('../models/rate');
const rateSchema = require('../schemas/rate');

// Get list of all rates
exports.getAllRates = (req, res, next) => {
    Rate.findAll({
        limit: req.query.limit,
        offset: req.query.offset,
    })
        .then((rates) => {
            res.json(rates);
        })
        .catch(next);
};

// Get rate with given productionId and userId
exports.getRate = (req, res, next) => {
    Rate.findOne({
        where: {
            productionId: req.params.productionId,
            userId: req.params.userId,
        },
    })
        .then((rate) => {
            res.json(rate);
        })
        .catch(next);
};

// Get rates of selected production
exports.getRatesByProduction = (req, res, next) => {
    Rate.findAll({
        where: {
            productionId: req.params.productionId,
        },
        limit: req.query.limit,
        offset: req.query.offset,
    })
        .then((rates) => {
            res.json(rates);
        })
        .catch(next);
};

// Get rates of selected user
exports.getRateByUser = (req, res, next) => {
    Rate.findAll({
        where: {
            userId: req.params.userId,
        },
        limit: req.query.limit,
        offset: req.query.offset,
    })
        .then((rates) => {
            res.json(rates);
        })
        .catch(next);
};

// Get rating stats (average rating, rates quantity) for selected production
exports.getProductionRatingStats = (req, res, next) => {
    Rate.findAll({
        where: {
            productionId: req.params.productionId,
        },
        attributes: [
            [Sequelize.fn('AVG', Sequelize.col('value')), 'average'],
            [Sequelize.fn('COUNT', Sequelize.col('value')), 'quantity'],
        ],
    })
        .then((ratingStats) => {
            res.json(ratingStats[0]);
        })
        .catch(next);
};

// Create rate
exports.createRate = (req, res, next) => {
    const { productionId, userId, value } = req.body;

    rateSchema.requiredKeys('productionId', 'userId', 'value').validate({
        productionId,
        userId,
        value,
    }, (err, validationValue) => {
        if (err) {
            next(err);
        } else {
            Rate.create(validationValue)
                .then((rate) => {
                    res.status(201).json(rate);
                })
                .catch(next);
        }
    });
};

// Update rate
exports.updateRate = (req, res, next) => {
    const { productionId, userId, value } = req.body;

    rateSchema.requiredKeys('productionId', 'userId', 'value').validate({
        productionId,
        userId,
        value,
    }, (err, validationValue) => {
        if (err) {
            next(err);
        } else {
            Rate.update(validationValue, {
                returning: true,
                where: {
                    productionId: validationValue.productionId,
                    userId: validationValue.userId,
                },
            })
                .then(([, [rate]]) => {
                    res.status(200).json(rate);
                })
                .catch(next);
        }
    });
};

// Delete rate
exports.deleteRate = (req, res, next) => {
    Rate.destroy({
        where: {
            productionId: req.params.productionId,
            userId: req.params.userId,
        },
    })
        .then(() => {
            res.status(200).end();
        })
        .catch(next);
};
