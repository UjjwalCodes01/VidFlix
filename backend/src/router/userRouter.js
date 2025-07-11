const {Router} = require('express');
const { SignIn, Login, ForgotPassword } = require('../controller/userController');

const router = Router();

router.post('/signin',SignIn)
router.post('/login',Login);
router.post('/forgot',ForgotPassword);


module.exports = router