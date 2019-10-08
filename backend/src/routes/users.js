const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user');
const RateController = require('../controllers/rate');
const UserProductionController = require('../controllers/userProduction');

// Create user
router.post('/register', UserController.createUser);

// Log in user
router.post('/login', UserController.loginUser);

// Log out user
router.get('/logout', UserController.logoutUser);

// Authenticate user (return basic informations about currently logged user)
router.get('/auth', UserController.authenticateUser);

// Get rates assigned to the user
router.get('/:userId/rates', RateController.getRateByUser);

// Get all user-production assignments of the user
router.get('/:userId/watchlist', UserProductionController.getUserProductionAssignmentsByUser);

module.exports = router;
