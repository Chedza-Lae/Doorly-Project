import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  forgot,
  login,
  refresh,
  register,
  reset
} from "../controllers/authController.js";

// CLEAN ARCHITECTURE: routes apenas encaminham requests para controllers.
const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/forgot-password", asyncHandler(forgot));
router.put("/reset-password/:token", asyncHandler(reset));
// NEW FEATURE: refresh token autenticado.
router.post("/refresh-token", verifyToken, asyncHandler(refresh));

export default router;
