import { Router, type Request, type Response } from "express";
import {
  loginUser,
  refreshTokens,
  registerUser,
} from "../services/auth.service";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password)
    return res.status(400).json({ error: "name, email, password required" });

  const result = await registerUser({ name, email, password });
  if (!result.ok)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password)
    return res.status(400).json({ error: "email, password required" });

  const result = await loginUser({ email, password });
  if (!result.ok)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken)
    return res.status(400).json({ error: "refreshToken required" });

  const result = await refreshTokens({ refreshToken });
  if (!result.ok)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

export default router;
