import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  mine,
  provider,
  remove
} from "../controllers/historyController.js";

// NEW FEATURE: routes completas de historico de servicos.
const router = express.Router();

router.use(verifyToken);
router.get("/me", asyncHandler(mine));
router.get("/prestador", asyncHandler(provider));
router.post("/", asyncHandler(create));
router.delete("/:id", isAdmin, asyncHandler(remove));

export default router;
