import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", protectRoutes, checkAuth);

export default router;
