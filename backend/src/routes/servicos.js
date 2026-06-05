import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  create,
  createDev,
  details,
  list,
  listMine,
  patch,
  remove,
  update
} from "../controllers/serviceController.js";

// CLEAN ARCHITECTURE: routes de servicos sem queries diretas.
const router = express.Router();

router.get("/", asyncHandler(list));
router.get("/me", verifyToken, asyncHandler(listMine));
router.post("/", verifyToken, asyncHandler(create));
router.post("/dev", asyncHandler(createDev));
router.get("/:id", asyncHandler(details));
router.put("/:id", verifyToken, asyncHandler(update));
router.patch("/:id", verifyToken, asyncHandler(patch));
router.delete("/:id", verifyToken, asyncHandler(remove));

export default router;
