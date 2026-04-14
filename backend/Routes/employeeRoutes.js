const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateEmployee, validatePagination } = require('../middleware/validators');

router.get('/', protect, adminOnly, validatePagination, getAllEmployees);
router.get('/:id', protect, adminOnly, getEmployee);
router.post('/', protect, adminOnly, validateEmployee, createEmployee);
router.put('/:id', protect, adminOnly, validateEmployee, updateEmployee);
router.delete('/:id', protect, adminOnly, deleteEmployee);

module.exports = router;
