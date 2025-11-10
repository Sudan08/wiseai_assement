import { z } from "zod";

// Refresh token schema
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

// Type exports
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];

