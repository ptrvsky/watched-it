const { Op } = require('sequelize');

const Production = require('../models/production');
const ProductionPlatform = require('../models/productionPlatform');
const productionSchema = require('../schemas/production');

Production.hasMany(ProductionPlatform);
ProductionPlatform.belongsTo(Production);

// Get all productions
exports.getAllProductions = (req, res, next) => {
  const order = {
    id: [['id']],
    recentlyFeatured: [['createdAt', 'DESC']],
    releaseDate: [['releaseDate']],
    releaseDateDesc: [['releaseDate', 'DESC']],
  };

  const where = {
    length: {
      [Op.or]: {
        // Line below allow null length value in case length queries are not provided
        [Op.eq]: req.query.lengthMin || req.query.lengthMax || null,
        [Op.and]: {
          [Op.gte]: req.query.lengthMin || 0,
          [Op.lte]: req.query.lengthMax || 999999,
        },
      },
    },
    releaseDate: {
      [Op.or]: {
        // Line below allow null date value in case date queries are not provided
        [Op.eq]: (req.query.yearMin === undefined && req.query.yearMax === undefined) ? null : new Date('9999-12-31'),
        [Op.and]: {
          [Op.gte]: new Date(`${req.query.yearMin || 1800}-01-01`),
          [Op.lte]: new Date(`${req.query.yearMax || 9999}-12-31`),
        },
      },
    },
  };

  // Querying by platformId
  const include = req.query.platformId ? [{
    model: ProductionPlatform,
    where: {
      platformId: req.query.platformId,
    },
  }] : null;

  if (req.query.isSerie !== undefined) {
    where.isSerie = req.query.isSerie;
  }

  if (req.query.ids !== undefined) {
    where.id = {
      [Op.in]: req.query.ids.split(',').map(Number),
    };
  }

  if (req.query.search !== undefined) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  }

  Production.findAndCountAll({
    where,
    include,
    limit: req.query.limit,
    offset: req.query.offset,
    order: order[req.query.order],
  })
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
