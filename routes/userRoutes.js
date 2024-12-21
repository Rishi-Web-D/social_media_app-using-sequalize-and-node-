const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.showRegisterForm);  
router.post('/register', userController.registerUser);     

router.get('/', userController.showLoginForm);        
router.post('/login', userController.loginUser);          

router.get('/dashboard', userController.renderDashboard); 

router.get('/new-post',userController.upload_post)

router.get('/my-posts', userController.myPosts);

router.get('/profile', userController.profile);


module.exports = router;
