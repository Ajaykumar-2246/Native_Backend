import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ username, fullName, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profileImg: user.profileImg,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPosts: user.savedPosts,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profileImg: user.profileImg,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        savedPosts: user.savedPosts,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Logout (client-side responsibility in React Native)
export const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Check Auth (validate token)
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
