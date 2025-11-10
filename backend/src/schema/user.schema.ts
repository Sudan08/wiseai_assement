import { z } from "zod";

// User registration schema
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

// User login schema
export const loginUserSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// User update schema
export const updateUserSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(1, "Name cannot be empty")
        .max(255, "Name is too long")
        .optional(),
      email: z.email("Invalid email address").optional(),
      role: z
        .enum(["user", "admin"], {
          message: "Role must be 'user' or 'admin'",
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field (name, email, role) is required",
    }),
});

// Get user by ID schema
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),
});
("4");
// Delete user schema
export const deleteUserSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),
});

// Type exports
export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
