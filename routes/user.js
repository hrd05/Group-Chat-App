const express = require('express');
const path = require('path');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/register',  (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views','signup.html'))
})

router.post('/register', userController.postUser);

router.get('/login', userController.getLogin);

module.exports = router;