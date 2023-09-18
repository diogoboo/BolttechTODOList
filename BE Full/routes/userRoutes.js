const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/change-password', authMiddleware, userController.changePassword);
router.delete('/delete', authMiddleware, userController.deleteUser);
router.post('/logout', authMiddleware, userController.logoutUser);

module.exports = router;
