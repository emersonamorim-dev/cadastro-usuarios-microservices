const express = require('express');
const AuthController = require('../interfaces/controllers/AuthController');

const router = express.Router();

const authController = new AuthController();

// Rota para login
router.post('/login', (req, res) => authController.login(req, res));

// Rota para registro
router.post('/register', (req, res) => authController.register(req, res));

module.exports = router;
