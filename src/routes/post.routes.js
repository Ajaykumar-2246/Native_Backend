import express from "express";
import {
  createPost,
  getAllPosts,
  likeUnlikePost,
} from "../controllers/post.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.middleware.js";
import { upload } from "../config/couldinary_multer.js";

const router = express.Router();

router.post("/createPost", protectRoutes, upload.single("image"), createPost);
router.get("/getAllPosts", protectRoutes, getAllPosts);

router.post("/likeUnlikePost/:id", protectRoutes, likeUnlikePost);
export default router;
