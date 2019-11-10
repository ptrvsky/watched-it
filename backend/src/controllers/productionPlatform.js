const ProductionPlatform = require('../models/productionPlatform');
const productionPlatformSchema = require('../schemas/productionPlatform');

// Get list of all production-platform assignments
exports.getAllProductionPlatformAssignments = (req, res, next) => {
  ProductionPlatform.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionPlatformAssignments) => {
      res.json(productionPlatformAssignments);
    })
    .catch(next);
};

// Get production-platform assignment with given personId and userId
exports.getProductionPlatformAssignment = (req, res, next) => {
  ProductionPlatform.findOne({
    where: {
      productionId: req.params.productionId,
      platformId: req.params.platformId,
    },
  })
    .then((productionPlatformAssignment) => {
      res.json(productionPlatformAssignment);
    })
    .catch(next);
};

// Get production-platform assignments of selected production
exports.getProductionPlatformAssignmentsByProduction = (req, res, next) => {
  ProductionPlatform.findAll({
    where: {
      productionId: req.params.productionId,
    },
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionPlatformAssignments) => {
      res.json(productionPlatformAssignments);
    })
    .catch(next);
};

// Get production-platform assignments of selected platform
exports.getProductionPlatformAssignmentsByPlatform = (req, res, next) => {
  ProductionPlatform.findAll({
    where: {
      platformId: req.params.platformId,
    },
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((productionPlatformAssignments) => {
      res.json(productionPlatformAssignments);
    })
    .catch(next);
};

// Create production-platform assignment
exports.createProductionPlatformAssignment = (req, res, next) => {
  const { productionId, platformId } = req.body;

  productionPlatformSchema.requiredKeys('productionId', 'platformId').validate({
    productionId,
    platformId,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      ProductionPlatform.create(value)
        .then((productionPlatformAssignment) => {
          res.status(201).json(productionPlatformAssignment);
        })
        .catch(next);
    }
  });
};

// Delete production-platform assignment
exports.deleteProductionPlatformAssignment = (req, res, next) => {
  ProductionPlatform.destroy({
    where: {
      productionId: req.params.productionId,
      platformId: req.params.platformId,
    },
  })
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
