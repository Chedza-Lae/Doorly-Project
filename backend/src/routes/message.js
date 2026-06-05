import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  inbox,
  reply,
  thread
} from "../controllers/messageController.js";

// CLEAN ARCHITECTURE: routes de mensagens sem queries diretas.
const router = express.Router();

router.post("/", verifyToken, asyncHandler(create));
router.get("/inbox", verifyToken, asyncHandler(inbox));
router.get("/thread", verifyToken, asyncHandler(thread));
router.post("/reply", verifyToken, asyncHandler(reply));

export default router;
