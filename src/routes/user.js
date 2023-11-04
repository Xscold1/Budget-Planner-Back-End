const express = require('express');
const router = express.Router();
const userController = require('../controller/user/user');
const auth = require('../middleware/auth');

router.post('/user/register',userController.REGISTER);
router.post('/user/login',userController.LOGIN);
router.put('/user/update',userController.EDIT_PROFILE);
router.get('/user/get-user',userController.GET_USER);

module.exports = router;