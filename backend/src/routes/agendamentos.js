import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  mine,
  provider,
  remove,
  status,
  update
} from "../controllers/scheduleController.js";

// NEW FEATURE: routes completas de agendamentos.
const router = express.Router();

router.use(verifyToken);
router.post("/", asyncHandler(create));
router.get("/me", asyncHandler(mine));
router.get("/prestador", asyncHandler(provider));
router.put("/:id", asyncHandler(update));
router.patch("/:id/status", asyncHandler(status));
router.delete("/:id", asyncHandler(remove));

export default router;
