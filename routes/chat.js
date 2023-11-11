const express = require('express');
const path = require('path');
const { route } = require('./user');
const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthenticate = require('../middleware/authenticate');

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname,  '../', 'views', 'chat-app.html'));
})

router.post('/chat', userAuthenticate.authenticate, chatController.postMessage);

router.get('/chatMessages', userAuthenticate.authenticate, chatController.getMessages);

module.exports = router;