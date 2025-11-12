import { Router } from "express";
import {
  createPropertyController,
  deletePropertyController,
  getAllPropertiesController,
  getPropertyByIdController,
  updatePropertyController,
} from "../controllers/property.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/properties", authMiddleware, getAllPropertiesController);

router.get("/properties/:id", authMiddleware, getPropertyByIdController);

router.post("/properties", authMiddleware, createPropertyController);

router.put("/properties/:id", authMiddleware, updatePropertyController);

router.delete("/properties/:id", authMiddleware, deletePropertyController);

// router.get(
//   "/recommended-properties",
//   authMiddleware,
//   getRecommendedPropertiesController
// );

export default router;
