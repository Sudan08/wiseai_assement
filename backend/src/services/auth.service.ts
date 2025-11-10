import bcrypt from "bcryptjs";
import { PrismaClient } from "../../generated/prisma/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const prisma = new PrismaClient();

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    return { ok: false, status: 409, error: "Email already in use" } as const;
  }

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password: hashed },
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

  return {
    ok: true,
    status: 201,
    data: { user, accessToken, refreshToken },
  } as const;
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user)
    return { ok: false, status: 401, error: "Invalid credentials" } as const;

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid)
    return { ok: false, status: 401, error: "Invalid credentials" } as const;

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

  return {
    ok: true,
    status: 200,
    data: { user: publicUser, accessToken, refreshToken },
  } as const;
}

export async function refreshTokens(input: { refreshToken: string }) {
  try {
    const payload = verifyRefreshToken(input.refreshToken);
    const userId = payload.sub as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return { ok: false, status: 401, error: "Invalid token" } as const;

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = signRefreshToken({ sub: user.id });
    return {
      ok: true,
      status: 200,
      data: { accessToken, refreshToken },
    } as const;
  } catch {
    return { ok: false, status: 401, error: "Invalid token" } as const;
  }
}
