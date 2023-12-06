const express = require('express');
const path = require('path');

const router = express.Router();

const userController = require('../controllers/user');
const userAuthenticate = require('../middleware/authenticate');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'home-page.html'));
})

router.get('/register',  (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views','signup.html'))
})

router.post('/register', userController.postUser);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/user/get-users', userAuthenticate.authenticate , userController.getUsers);

router.post('/user/create-group', userAuthenticate.authenticate, userController.createGroup );

router.get('/user/get-mygroups', userAuthenticate.authenticate,  userController.getGroups);

router.get('/user/get-group', userAuthenticate.authenticate ,userController.getGroupDetail);

router.get('/user/get-group-members', userAuthenticate.authenticate ,userController.getGroupMember);

router.post('/user/update-group', userAuthenticate.authenticate, userController.updateGroup);

module.exports = router;