import { User } from "../models/user.model.js";

export const getLoggedInUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(req.userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following?.length || 0;
    const followers = user.followers?.length || 0;

    res.status(200).json({ user, following, followers });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserSavedPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("savedPosts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedPosts: user.savedPosts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
