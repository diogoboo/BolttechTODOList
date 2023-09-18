const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const secretKey = config.JWT_SECRET_KEY || 'secret_key_missing';
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findByUsernameOrEmail(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = await User.create({ username, email, password });

    const token = jwt.sign({ userId: newUser.userId }, secretKey);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsernameOrEmail(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.userId }, secretKey);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

const logoutUser = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error during logout' });
      }

      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;

    // Update user details by user ID
    const updated = await User.updateById(userId, { username, email });

    if (updated) {
      res.status(200).json({ message: 'User details updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { newPassword } = req.body;


    const changed = await User.changePassword(userId, newPassword);

    if (changed) {
      res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error changing user password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const deleted = await User.deleteById(userId);

    if (deleted) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser,
  logoutUser,
};
