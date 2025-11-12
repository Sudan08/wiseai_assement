import { Router } from "express";
import {
  loginController,
  refreshController,
  registerController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema } from "../schema";

const router = Router();

router.post("/register", validate(registerUserSchema), registerController);

router.post("/login", validate(loginUserSchema), loginController);

router.post("/refresh", refreshController);

export default router;
