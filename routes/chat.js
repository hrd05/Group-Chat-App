const express = require('express');
const path = require('path');
const { route } = require('./user');
const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthenticate = require('../middleware/authenticate');

router.get('/user',  (req, res) => {
    res.sendFile(path.join(__dirname,  '../', 'views', 'main.html'));
})

router.post('/chat', userAuthenticate.authenticate, chatController.postMessage);

router.get('/chatMessages', userAuthenticate.authenticate, chatController.getMessages);

module.exports = router;