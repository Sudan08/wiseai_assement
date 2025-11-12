"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFavouritesController = getAllFavouritesController;
exports.getFavouriteByIdController = getFavouriteByIdController;
exports.createFavouriteController = createFavouriteController;
exports.deleteFavouriteController = deleteFavouriteController;
exports.deleteFavouriteByUserAndPropertyController = deleteFavouriteByUserAndPropertyController;
exports.getFavouritebyUserId = getFavouritebyUserId;
const prismaClient_1 = require("../lib/prismaClient");
async function getAllFavouritesController(req, res) {
    try {
        const { userId, propertyId } = req.query;
        const where = {};
        if (userId)
            where.userId = userId;
        if (propertyId)
            where.propertyId = propertyId;
        const favourites = await prismaClient_1.prisma.favourite.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(favourites);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch favourites" });
    }
}
async function getFavouriteByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Favourite ID is required" });
        }
        const favourite = await prismaClient_1.prisma.favourite.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!favourite) {
            return res.status(404).json({ error: "Favourite not found" });
        }
        return res.status(200).json(favourite);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch favourite" });
    }
}
async function createFavouriteController(req, res) {
    try {
        const { userId, propertyId } = req.body;
        if (!userId || !propertyId) {
            return res
                .status(400)
                .json({ error: "userId and propertyId are required" });
        }
        // Verify user exists
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Verify property exists
        const property = await prismaClient_1.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        // Check if favourite already exists (unique constraint)
        const existingFavourite = await prismaClient_1.prisma.favourite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        if (existingFavourite) {
            return res.status(409).json({ error: "Property already in favourites" });
        }
        const favourite = await prismaClient_1.prisma.favourite.create({
            data: {
                userId,
                propertyId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(201).json(favourite);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create favourite" });
    }
}
async function deleteFavouriteController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Favourite ID is required" });
        }
        const existingFavourite = await prismaClient_1.prisma.favourite.findUnique({
            where: { id },
        });
        if (!existingFavourite) {
            return res.status(404).json({ error: "Favourite not found" });
        }
        await prismaClient_1.prisma.favourite.delete({
            where: { id },
        });
        return res.status(200).json({ message: "Favourite removed successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete favourite" });
    }
}
async function deleteFavouriteByUserAndPropertyController(req, res) {
    try {
        const { userId, propertyId } = req.params;
        if (!userId || !propertyId) {
            return res
                .status(400)
                .json({ error: "userId and propertyId are required" });
        }
        const existingFavourite = await prismaClient_1.prisma.favourite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        if (!existingFavourite) {
            return res.status(404).json({ error: "Favourite not found" });
        }
        await prismaClient_1.prisma.favourite.delete({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId,
                },
            },
        });
        return res.status(200).json({ message: "Favourite removed successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete favourite" });
    }
}
async function getFavouritebyUserId(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const favourites = await prismaClient_1.prisma.favourite.findMany({
            where: { userId },
            select: {
                id: true,
                createdAt: true,
                property: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        return res.status(200).json(favourites);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch favourites" });
    }
}
