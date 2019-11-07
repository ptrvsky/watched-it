const Platform = require('../models/platform');
const platformSchema = require('../schemas/platform');

// Get all platforms
exports.getAllPlatforms = (req, res, next) => {
  Platform.findAndCountAll({
    limit: req.query.limit,
    offset: req.query.offset,
  })
    .then((people) => {
      res.json(people);
    })
    .catch(next);
};

// Get platform with the given id
exports.getPlatform = (req, res, next) => {
  Platform.findByPk(req.params.id)
    .then((platform) => {
      res.json(platform);
    })
    .catch(next);
};

// Add platform
exports.createPlatform = (req, res, next) => {
  const { name, logoId } = req.body;

  platformSchema.requiredKeys('name').validate({
    name,
    logoId,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      Platform.create(value)
        .then((platform) => {
          res.status(201).json(platform);
        })
        .catch(next);
    }
  });
};

// Update platform with the given id
exports.updatePlatform = (req, res, next) => {
  const { name, logoId } = req.body;

  platformSchema.requiredKeys('name').validate({
    name,
    logoId: logoId || null,
    /*  Null is added in case the request body doesn't contain unrequired attribute.
    Without it, this attribute would remain as it is what is inconsistent
    with PUT method specification. */
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      Platform.update(value, {
        returning: true,
        where: {
          id: req.params.id,
        },
      })
        .then(([, [platform]]) => {
          res.status(200).json(platform);
        })
        .catch(next);
    }
  });
};

// Patch platform with the given id
exports.patchPlatform = (req, res, next) => {
  const { name, logoId } = req.body;

  platformSchema.validate({
    name,
    logoId,
  }, (err, value) => {
    if (err) {
      next(err);
    } else {
      Platform.update(value, {
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

// Delete platform with the given id
exports.deletePlatform = (req, res, next) => {
  Platform.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.status(200).end();
    })
    .catch(next);
};
