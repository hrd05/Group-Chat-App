const express = require('express');
const path = require('path');
const { route } = require('./user');
const router = express.Router();

const chatController = require('../controllers/chat');

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname,  '../', 'views', 'chat-app.html'));
})

router.post('/chat', chatController.postMessage);

module.exports = router;