import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { prisma } from "../lib/prismaClient";

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = signRefreshToken({ sub: user.id });

    return res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: "Failed to register user" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "email, password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = signRefreshToken({ sub: user.id });

    return res
      .status(200)
      .json({ user: publicUser, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to login" });
  }
}

export async function refreshController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body ?? {};

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken required" });
    }

    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.sub as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = signRefreshToken({ sub: user.id });

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
