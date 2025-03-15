import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.middleware.js";
import { upload } from "../config/couldinary_multer.js";

const router = express.Router();

// Create a new post with an optional image upload
router.post("/createPost", protectRoutes, upload.single("image"), createPost);

// Get all posts
router.get("/getAllPosts", protectRoutes, getAllPosts);

export default router;