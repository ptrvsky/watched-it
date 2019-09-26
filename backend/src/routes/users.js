const express = require('express');

const router = express.Router();
const UserController = require('../controllers/user');

// Create user
router.post('/register', UserController.createUser);

// Log in user
router.post('/login', UserController.loginUser);

// Log out user
router.get('/logout', UserController.logoutUser);

// Authenticate user (return basic informations about currently logged user)
router.get('/auth', UserController.authenticateUser);

module.exports = router;
