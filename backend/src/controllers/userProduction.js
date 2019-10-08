const UserProduction = require('../models/userProduction');
const userProductionSchema = require('../schemas/userProduction');

// Get user-production assignments of selected user
exports.getUserProductionAssignmentsByUser = (req, res, next) => {
    UserProduction.findAll({
        where: {
            userId: req.params.userId,
        },
        limit: req.query.limit,
        offset: req.query.offset,
    })
        .then((usersProductionsAssignments) => {
            res.status(200).json(usersProductionsAssignments);
        })
        .catch(next);
};

// Get assignment between production and user with given ids
exports.getUserProductionAssignmentByIds = (req, res, next) => {
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
