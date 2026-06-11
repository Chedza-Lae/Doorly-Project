import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ban,
  logs,
  removeService,
  removeUser,
  resetPassword,
  role,
  services,
  unban,
  users
} from "../controllers/adminController.js";

// CLEAN ARCHITECTURE: routes admin finas e protegidas.
const router = express.Router();

router.use(verifyToken, isAdmin);
router.get("/logs", asyncHandler(logs));
router.get("/users", asyncHandler(users));
router.delete("/users/:id", asyncHandler(removeUser));
router.put("/users/:id/reset-password", asyncHandler(resetPassword));
router.put("/users/:id/ban", asyncHandler(ban));
router.put("/users/:id/unban", asyncHandler(unban));
// NEW FEATURE: alterar permissões.
router.patch("/users/:id/role", asyncHandler(role));
router.get("/services", asyncHandler(services));
router.delete("/services/:id", asyncHandler(removeService));

export default router;
