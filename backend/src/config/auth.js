module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next('Permission denied');
};
