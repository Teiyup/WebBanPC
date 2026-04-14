const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getAllCustomers, banUser, unbanUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRegister, validateLogin, validateUpdateProfile } = require('../middleware/validators');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);
router.get('/customers', protect, adminOnly, getAllCustomers);
router.put('/ban/:id', protect, adminOnly, banUser);
router.put('/unban/:id', protect, adminOnly, unbanUser);

module.exports = router;
