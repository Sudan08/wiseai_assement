import { Router } from "express";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/users", authMiddleware, getAllUsersController);

router.get("/users/:id", authMiddleware, getUserByIdController);

router.put("/users/:id", authMiddleware, updateUserController);

router.delete("/users/:id", authMiddleware, deleteUserController);

export default router;
