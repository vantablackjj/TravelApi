import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "Lacking information" });
    }

    const isDuplicate = await User.findOne({ username });
    if (isDuplicate)
      return res.status(409).json({ message: "Username already exists" });

    // ✅ Correct hashing
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { password, username, email } = req.body;
    if (!password || (!username && !email))
      return res.status(400).json({ message: "Lacking information" });

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Use correct field name here
    const isPasswordCorrect = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect password or username" });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.displayName} logged in`,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
