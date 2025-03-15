import express from "express";
import {
  getLoggedInUser,
  getUserSavedPosts,
} from "../controllers/user.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.middleware.js";

const router = express.Router();

router.get("/getLoggedInUser", protectRoutes, getLoggedInUser);
router.get("/getUserSavedPosts", protectRoutes, getUserSavedPosts);

export default router;
