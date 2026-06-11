import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  legacyProfile,
  profile,
  updateMe,
  updatePassword
} from "../controllers/userController.js";

// CLEAN ARCHITECTURE: routes finas de utilizadores.
const router = express.Router();

router.get("/profile", verifyToken, asyncHandler(legacyProfile));
router.get("/me", verifyToken, asyncHandler(profile));
router.put("/me", verifyToken, asyncHandler(updateMe));
router.put("/password", verifyToken, asyncHandler(updatePassword));

export default router;
