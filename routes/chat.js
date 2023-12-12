const express = require('express');
const path = require('path');
const { route } = require('./user');
const router = express.Router();

const chatController = require('../controllers/chat');
const userAuthenticate = require('../middleware/authenticate');
const multerMiddleware = require('../middleware/multer');
const upload = multerMiddleware.multer.single('image');

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'main.html'));
})

router.post('/user/post-chat', userAuthenticate.authenticate, chatController.postMessage);

router.post('/user/post-image', userAuthenticate.authenticate, upload, chatController.postImage);

router.get('/user/get-commonChat', userAuthenticate.authenticate, chatController.getCommonChat);

router.get('/user/get-groupChat', userAuthenticate.authenticate, chatController.getGroupChat);

module.exports = router;