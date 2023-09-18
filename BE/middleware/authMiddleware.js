const jwt = require('jsonwebtoken');
const config = require('../config');

const secretKey = config.JWT_SECRET_KEY || 'secret_key_missing'; 

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token'); 

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};
