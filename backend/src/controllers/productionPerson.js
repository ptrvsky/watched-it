const ProductionPerson = require('../models/productionPerson');
const productionPersonSchema = require('../schemas/productionPerson');

// Get list of all production-person assignments
exports.getAllProductionPersonAssignments = (req, res, next) => {
  ProductionPerson.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionsPeopleAssignments) => {
      res.json(productionsPeopleAssignments);
    })
    .catch(next);
};

// Get production-person assignment with given id
exports.getProductionPersonAssignment = (req, res, next) => {
  ProductionPerson.findByPk(req.params.id)
    .then((productionPersonAssignment) => {
      res.json(productionPersonAssignment);
    })
    .catch(next);
};

// Get production-person assignments of selected person
exports.getProductionPersonAssignmentsByPerson = (req, res, next) => {
  ProductionPerson.findAll({
    where: {
      personId: req.params.personId,
    },
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionsPeople) => {
      res.json(productionsPeople);
    })
    .catch(next);
};

// Get production-person assignments of selected production
exports.getProductionPersonAssignmentsByProduction = (req, res, next) => {
  ProductionPerson.findAll({
    where: {
      productionId: req.params.productionId,
    },
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionsPeople) => {
      res.json(productionsPeople);
    })
    .catch(next);
};

// Get assignment between production and person with given ids
/*  There may be more than one assignment, because person
    may be assigned to the same production in different roles (e.g. acting director) */
exports.getProductionPersonAssignmentsByIds = (req, res, next) => {
  ProductionPerson.findAll({
    where: {
      personId: req.params.personId,
      productionId: req.params.productionId,
    },
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionPersonAssignments) => {
      res.json(productionPersonAssignments);
    })
    .catch(next);
};

// Get list of selected person professions (e.g. [Actor, Director, Writer])
exports.getPersonProfessions = (req, res, next) => {
  function checkProfession(profession) {
    return ProductionPerson.findOne({
      where: {
        personId: req.params.personId,
        role: profession,
      },
    })
      .then((productionPerson) => {
        if (productionPerson) return profession;
        return null;
      });
  }

  Promise.all([checkProfession('Actor'),
    checkProfession('Writer'),
    checkProfession('Director'),
    checkProfession('Composer'),
    checkProfession('Producer')])
    .then((values) => res.json(values.filter((value) => value !== null)))
    .catch(next);
};

// Create production-person assignment
exports.createProductionPersonAssignment = (req, res, next) => {
  const { personId, productionId, role, description } = req.body;

  productionPersonSchema.requiredKeys('personId', 'productionId', 'role').validate({
    personId,
    productionId,
    role,
    description,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      ProductionPerson.create(value)
        .then((productionPersonAssignment) => {
          res.status(201).json(productionPersonAssignment);
        })
        .catch(next);
    }
  });
};

// Update production-person assignment
exports.updateProductionPersonAssignment = (req, res, next) => {
  const { personId, productionId, role, description } = req.body;

  productionPersonSchema.requiredKeys('personId', 'productionId', 'role').validate({
    personId,
    productionId,
    role,
    description: description || null,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      ProductionPerson.update(value, {
        returning: true,
        where: {
          id: req.params.id,
        },
      })
        .then(([, [productionPersonAssignment]]) => {
          res.status(200).json(productionPersonAssignment);
        })
        .catch(next);
    }
  });
};

// Patch production-person assignment
exports.patchProductionPersonAssignment = (req, res, next) => {
  const { personId, productionId, role, description } = req.body;

  productionPersonSchema.validate({
    personId,
    productionId,
    role,
    description,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      ProductionPerson.update(value, {
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

// Delete production-person assignment
exports.deleteProductionPersonAssignment = (req, res, next) => {
  ProductionPerson.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
