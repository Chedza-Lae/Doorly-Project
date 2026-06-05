import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  list,
  remove
} from "../controllers/favoriteController.js";

// CLEAN ARCHITECTURE: routes de favoritos sem queries diretas.
const router = express.Router();

router.use(verifyToken);
router.get("/", asyncHandler(list));
router.post("/", asyncHandler(create));
router.delete("/", asyncHandler(remove));

export default router;
