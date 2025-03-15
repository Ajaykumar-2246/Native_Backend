import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    // Validate user
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if an image is uploaded
    let imageUrl = "";
    if (req.file) imageUrl = req.file.path; // Cloudinary URL

    // Create and save post
    const post = new Post({ userId: user._id, description, image: imageUrl });
    await post.save();

    return res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "-password");
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
