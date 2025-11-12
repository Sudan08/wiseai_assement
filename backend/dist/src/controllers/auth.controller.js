"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.refreshController = refreshController;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const prismaClient_1 = require("../lib/prismaClient");
async function registerController(req, res) {
    try {
        const { name, email, password } = req.body ?? {};
        if (!name || !email || !password) {
            return res.status(400).json({ error: "name, email, password required" });
        }
        const existing = await prismaClient_1.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await prismaClient_1.prisma.user.create({
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
        return res.status(201).json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to register user" });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ error: "email, password required" });
        }
        const user = await prismaClient_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
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
        const accessToken = (0, jwt_1.signAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id });
        return res.status(200).json({
            user: publicUser,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to login" });
    }
}
async function refreshController(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(400)
                .json({ error: "refreshToken required in Authorization header" });
        }
        const refreshToken = authHeader.split(" ")[1];
        if (!refreshToken) {
            return res.status(400).json({ error: "refreshToken required" });
        }
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const userId = payload.userId;
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const accessToken = (0, jwt_1.signAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const newRefreshToken = (0, jwt_1.signRefreshToken)({ userId: user.id });
        return res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
