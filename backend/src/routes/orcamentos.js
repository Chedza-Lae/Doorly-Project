import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  details,
  mine,
  provider,
  remove,
  status,
  update
} from "../controllers/quoteController.js";

// CLEAN ARCHITECTURE: routes de pedidos de orcamento sem queries diretas.
const router = express.Router();

router.use(verifyToken);
router.post("/", asyncHandler(create));
// NEW FEATURE: CRUD completo de pedidos.
router.get("/", asyncHandler(mine));
router.get("/me", asyncHandler(mine));
router.get("/provider", asyncHandler(provider));
router.get("/:id", asyncHandler(details));
router.put("/:id", asyncHandler(update));
router.patch("/:id/status", asyncHandler(status));
router.delete("/:id", asyncHandler(remove));

export default router;
