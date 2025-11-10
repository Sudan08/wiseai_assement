import { Router } from "express";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.get("/users", getAllUsersController);

router.get("/users/:id", getUserByIdController);

router.put("/users/:id", updateUserController);

router.delete("/users/:id", deleteUserController);

export default router;
