const express = require('express');
const employeeController = require('../controller/employeeController');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); 

router.post('/create', verifyToken, employeeController.createEmployee); 
router.get('/getAll', verifyToken, employeeController.getAllEmployees); 
router.get('/get/:id',verifyToken,employeeController.getEmployeeById);
router.put('/update/:id', verifyToken, employeeController.updateEmployee); 
router.delete('/delete/:id', verifyToken, employeeController.deleteEmployee); 

module.exports = router;
