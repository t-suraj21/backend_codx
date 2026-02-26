import jwt from "jsonwebtoken";
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided, authorization denied" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false,
      message: "Token is invalid or expired" 
    });
  }
};

export default authMiddleware;
