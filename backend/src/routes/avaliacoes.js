import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  byService,
  create,
  provider
} from "../controllers/reviewController.js";

// CLEAN ARCHITECTURE: routes de avaliações sem queries diretas.
const router = express.Router();

router.get("/service/:id", asyncHandler(byService));
router.get("/provider", verifyToken, asyncHandler(provider));
router.post("/", verifyToken, asyncHandler(create));

export default router;
