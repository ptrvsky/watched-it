/* eslint-disable no-shadow */
const Sequelize = require('sequelize');

const ProductionRate = require('../models/productionRate');
const productionRateSchema = require('../schemas/productionRate');

// Get list of all rates
exports.getAllRates = (req, res, next) => {
  ProductionRate.findAll({
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
  ProductionRate.findOne({
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
  ProductionRate.findAll({
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
  ProductionRate.findAll({
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
  ProductionRate.findAll({
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

  productionRateSchema.requiredKeys('productionId', 'userId', 'value').validate({
    productionId,
    userId,
    value,
  }, (err, validationValue) => {
    if (err) {
      next(err);
    } else {
      ProductionRate.create(validationValue)
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

  productionRateSchema.requiredKeys('productionId', 'userId', 'value').validate({
    productionId,
    userId,
    value,
  }, (err, validationValue) => {
    if (err) {
      next(err);
    } else {
      ProductionRate.findOne({
        where: {
          productionId: validationValue.productionId,
          userId: validationValue.userId,
        },
      })
        .then((rate) => {
          if (rate) {
            ProductionRate.update(validationValue, {
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
          } else {
            ProductionRate.create(validationValue)
              .then((rate) => {
                res.status(201).json(rate);
              })
              .catch(next);
          }
        })
        .catch(next);
    }
  });
};

// Delete rate
exports.deleteRate = (req, res, next) => {
  ProductionRate.destroy({
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
