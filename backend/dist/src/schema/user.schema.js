"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.getUserByIdSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// User registration schema
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required").max(255, "Name is too long"),
        email: zod_1.z.email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
// User login schema
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email address"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
// User update schema
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid user ID"),
    }),
    body: zod_1.z
        .object({
        name: zod_1.z
            .string()
            .min(1, "Name cannot be empty")
            .max(255, "Name is too long")
            .optional(),
        email: zod_1.z.email("Invalid email address").optional(),
        role: zod_1.z
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
exports.getUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid user ID"),
    }),
});
("4");
// Delete user schema
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid user ID"),
    }),
});
