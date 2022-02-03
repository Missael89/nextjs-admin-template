const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const localeController = require('../controllers/localeController');

router.get('/', (req, res) => {
    res.send('Api- Xiimbah Mexikoo Tours');
});

router.get('/api/auth', authController.isAuthenticated2);
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.get('/api/logout', authController.logout);

//catálogos
router.post('/api/locale', localeController.crud);

module.exports = router;