import jwt from "jsonwebtoken";
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Retrieve token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Cannot find access token" });
    }

    // 2. Verify token
    let decodeUser;
    try {
      decodeUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.log(err);
      return res.status(403).json({ message: "Access token invalid" });
    }

    // 3. Find user in DB
    const user = await User.findById(decodeUser.userId).select('-hashPassword');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
