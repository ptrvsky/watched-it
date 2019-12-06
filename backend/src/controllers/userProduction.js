const Production = require('../models/production');
const UserProduction = require('../models/userProduction');
const userProductionSchema = require('../schemas/userProduction');

UserProduction.belongsTo(Production);

// Get user-production assignments of selected user
exports.getUserProductionAssignmentsByUser = (req, res, next) => {
  if (req.user) {
    // eslint-disable-next-line eqeqeq
    if (req.user.id == req.params.userId) {
      UserProduction.findAll({
        where: {
          userId: req.params.userId,
        },
        include: Production,
        limit: req.query.limit,
        offset: req.query.offset,
      })
        .then((usersProductionsAssignments) => {
          res.status(200).json(usersProductionsAssignments);
        })
        .catch(next);
    }
  } else {
    res.status(401).end();
  }
};

// Get assignment between production and user with given ids
exports.getUserProductionAssignmentByIds = (req, res, next) => {
  if (req.user) {
    // eslint-disable-next-line eqeqeq
    if (req.user.id == req.params.userId) {
      UserProduction.findOne({
        where: {
          userId: req.params.userId,
          productionId: req.params.productionId,
        },
      })
        .then((userProductionAssignment) => {
          res.status(200).json(userProductionAssignment);
        })
        .catch(next);
    }
  } else {
    res.status(401).end();
  }
};

// Create user-production assignment
exports.createUserProductionAssignment = (req, res, next) => {
  const { userId, productionId } = req.body;

  userProductionSchema.requiredKeys('userId', 'productionId').validate({
    userId,
    productionId,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      UserProduction.create(value)
        .then((userProductionAssignment) => {
          res.status(201).json(userProductionAssignment);
        })
        .catch(next);
    }
  });
};

// Delete user-production assignment
exports.deleteProductionPersonAssignment = (req, res, next) => {
  UserProduction.destroy({
    where: {
      userId: req.params.userId,
      productionId: req.params.productionId,
    },
  })
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
