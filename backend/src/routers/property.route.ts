import { getAllPropertiesSchema } from "./../schema/property.schema";
import { Router } from "express";
import {
  createPropertyController,
  deletePropertyController,
  getAllPropertiesController,
  getMyPropertiesController,
  getPropertyByIdController,
  getRecommendedPropertiesController,
  getSimilarPropertiesController,
  updatePropertyController,
} from "../controllers/property.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { create } from "domain";
import { createPropertySchema } from "../schema";

const router = Router();

router.get("/properties/my", authMiddleware, getMyPropertiesController);

router.get(
  "/properties",
  authMiddleware,
  validate(getAllPropertiesSchema),
  getAllPropertiesController
);

router.get(
  "/properties/recommended",
  authMiddleware,
  getRecommendedPropertiesController
);

router.get(
  "/properties/:id/similar",
  authMiddleware,
  getSimilarPropertiesController
);

router.get("/properties/:id", authMiddleware, getPropertyByIdController);

router.post(
  "/properties",
  authMiddleware,
  validate(createPropertySchema),
  createPropertyController
);
router.patch(
  "/properties/:id",
  authMiddleware,
  validate(createPropertySchema),
  updatePropertyController
);
router.delete("/properties/:id", authMiddleware, deletePropertyController);

export default router;
