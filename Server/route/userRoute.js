
const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/create', userController.createUser);  
router.post('/login',userController.loginUser); 
router.get('/getAll', userController.getAllUsers);         
router.put('/update/:id', userController.updateUser);  
router.delete('/delete/:id', userController.deleteUser);  

module.exports = router;