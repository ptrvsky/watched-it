/* eslint-disable no-shadow */
const Sequelize = require('sequelize');

const PersonRate = require('../models/personRate');
const personRateSchema = require('../schemas/personRate');

// Get list of all rates
exports.getAllRates = (req, res, next) => {
  PersonRate.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((rates) => {
      res.json(rates);
    })
    .catch(next);
};

// Get rate with given personId and userId
exports.getRate = (req, res, next) => {
  PersonRate.findOne({
    where: {
      personId: req.params.personId,
      userId: req.params.userId,
    },
  })
    .then((rate) => {
      res.json(rate);
    })
    .catch(next);
};

// Get rates of selected person
exports.getRatesByPerson = (req, res, next) => {
  PersonRate.findAll({
    where: {
      personId: req.params.personId,
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
  PersonRate.findAll({
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

// Get rating stats (average rating, rates quantity) for selected person
exports.getPersonRatingStats = (req, res, next) => {
  PersonRate.findAll({
    where: {
      personId: req.params.personId,
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
  const { personId, userId, value } = req.body;

  personRateSchema.requiredKeys('personId', 'userId', 'value').validate({
    personId,
    userId,
    value,
  }, (err, validationValue) => {
    if (err) {
      next(err);
    } else {
      PersonRate.create(validationValue)
        .then((rate) => {
          res.status(201).json(rate);
        })
        .catch(next);
    }
  });
};

// Update rate
exports.updateRate = (req, res, next) => {
  const { personId, userId, value } = req.body;

  personRateSchema.requiredKeys('personId', 'userId', 'value').validate({
    personId,
    userId,
    value,
  }, (err, validationValue) => {
    if (err) {
      next(err);
    } else {
      PersonRate.findOne({
        where: {
          personId: validationValue.personId,
          userId: validationValue.userId,
        },
      })
        .then((rate) => {
          if (rate) {
            PersonRate.update(validationValue, {
              returning: true,
              where: {
                personId: validationValue.personId,
                userId: validationValue.userId,
              },
            })
              .then(([, [rate]]) => {
                res.status(200).json(rate);
              })
              .catch(next);
          } else {
            PersonRate.create(validationValue)
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
  PersonRate.destroy({
    where: {
      personId: req.params.personId,
      userId: req.params.userId,
    },
  })
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
