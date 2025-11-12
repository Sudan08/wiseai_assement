"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersController = getAllUsersController;
exports.getUserByIdController = getUserByIdController;
exports.updateUserController = updateUserController;
exports.deleteUserController = deleteUserController;
const prismaClient_1 = require("../lib/prismaClient");
async function getAllUsersController(req, res) {
    try {
        const users = await prismaClient_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}
async function getUserByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = await prismaClient_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch user" });
    }
}
async function updateUserController(req, res) {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body ?? {};
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        if (!name && !email && !role) {
            return res
                .status(400)
                .json({ error: "At least one field (name, email, role) is required" });
        }
        if (role && !["user", "admin"].includes(role)) {
            return res.status(400).json({ error: "Role must be 'user' or 'admin'" });
        }
        const existingUser = await prismaClient_1.prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        if (email && email !== existingUser.email) {
            const emailExists = await prismaClient_1.prisma.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                return res.status(409).json({ error: "Email already in use" });
            }
        }
        const updatedUser = await prismaClient_1.prisma.user.update({
            where: { id },
            data: { name, email, role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update user" });
    }
}
async function deleteUserController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const existingUser = await prismaClient_1.prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        await prismaClient_1.prisma.user.delete({
            where: { id },
        });
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete user" });
    }
}
