const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user');
const ProductionRateController = require('../controllers/productionRate');
const PersonRateController = require('../controllers/personRate');
const UserProductionController = require('../controllers/userProduction');

// Create user
router.post('/register', UserController.createUser);

// Log in user
router.post('/login', UserController.loginUser);

// Log out user
router.get('/logout', UserController.logoutUser);

// Authenticate user (return basic informations about currently logged user)
router.get('/auth', UserController.authenticateUser);

// Get productions rates assigned to the user
router.get('/:userId/productions-rates', ProductionRateController.getRateByUser);

// Get people rates assigned to the user
router.get('/:userId/people-rates', PersonRateController.getRateByUser);

// Get all user-production assignments of the user
router.get('/:userId/watchlist', UserProductionController.getUserProductionAssignmentsByUser);

module.exports = router;
