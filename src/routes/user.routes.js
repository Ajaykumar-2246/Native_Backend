import express from "express";
import { getLoggedInUser } from "../controllers/user.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.middleware.js";

const router = express.Router();

router.get('/getLoggedInUser', protectRoutes, getLoggedInUser);

export default router;