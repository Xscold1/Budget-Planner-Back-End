const express = require('express');
const router = express.Router();
const userController = require('../controller/user/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/user/register',userController.REGISTER);
router.post('/user/login',userController.LOGIN);
router.post('/user/forgot-password',userController.FORGOT_PASSWORD);
router.put('/user/update',auth,upload.single('imageUrl'),userController.EDIT_PROFILE);
router.get('/user/get-user',auth,userController.GET_USER);
router.post('/user/verify-2fa',userController.VERIFY_2FA);
router.post('/user/toggle-2fa',userController.TOGGLE_2FA);
router.put('/user/logout',userController.LOGOUT);


module.exports = router;