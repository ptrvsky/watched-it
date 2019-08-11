const ProductionPerson = require('../models/productionPerson');
const productionPersonSchema = require('../schemas/productionPerson');

// Get list of all production-person assignments 
exports.getProductionPersonAssignmentsList = (req, res) => {
    ProductionPerson.findAll()
        .then(productionsPeopleAssignments => {
            res.json(productionsPeopleAssignments);
        })
        .catch(err => console.log(err));
};

// Get production-person assignment with given id
exports.getProductionPersonAssignmentById = (req, res) => {
    ProductionPerson.findAll({
            where: {
                id: req.params.id,
            }
        })
        .then(productionPersonAssignment => {
            res.json(productionPersonAssignment);
        })
        .catch(err => console.log(err));
};

// Get assignment between production and person with given ids
/*  There may be more than one assignment, because person 
    may be assigned to the same production in different roles (e.g. acting director) */
exports.getProductionPersonAssignmentsByIds = (req, res) => {
        ProductionPerson.findAll({
                where: {
                    personId: req.params.personId,
                    productionId: req.params.productionId
                }
            })
            .then(productionPersonAssignments => {
                res.json(productionPersonAssignments);
            })
            .catch(err => console.log(err));
    };

// Create production-person assignment
exports.createProductionPersonAssignment = (req, res) => {
    let { personId, productionId, role } = req.body;

    productionPersonSchema.requiredKeys('personId', 'productionId', 'role').validate({
        personId: personId,
        productionId: productionId,
        role: role
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            ProductionPerson.create(value)
                .then(productionPersonAssignment => {
                    console.log(`Person with id: ${personId} has been assigned to the production with id ${productionId} as ${role}.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Update production-person assignment
exports.updateProductionPersonAssignment = (req, res) => {
    let { personId, productionId, role } = req.body;

    productionPersonSchema.validate({
        personId: personId,
        productionId: productionId,
        role: role
    }, (err, value) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            ProductionPerson.update(value, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(productionPersonAssignment => {
                    console.log(`Production-person ssignment with id: ${req.params.id} has been updated.`);
                    res.status(200).end();
                })
                .catch(err => console.log(err));
        }
    });
};

// Delete production-person assignment
exports.deleteProductionPersonAssignment = (req, res) => {
    ProductionPerson.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(productionPerson => {
            console.log(`Assignment with id: ${req.params.id} has been deleted.`);
            res.status(200).end();
        })
        .catch(err => console.log(err));
};