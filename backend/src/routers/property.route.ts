import { Router } from "express";
import {
  createPropertyController,
  deletePropertyController,
  getAllPropertiesController,
  getPropertyByIdController,
  updatePropertyController,
} from "../controllers/property.controller";

const router = Router();

router.get("/properties", getAllPropertiesController);

router.get("/properties/:id", getPropertyByIdController);

router.post("/properties", createPropertyController);

router.put("/properties/:id", updatePropertyController);

router.delete("/properties/:id", deletePropertyController);

export default router;
