"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPropertiesController = getAllPropertiesController;
exports.getPropertyByIdController = getPropertyByIdController;
exports.createPropertyController = createPropertyController;
exports.updatePropertyController = updatePropertyController;
exports.deletePropertyController = deletePropertyController;
exports.getRecommendedPropertiesController = getRecommendedPropertiesController;
exports.getSimilarPropertiesController = getSimilarPropertiesController;
exports.getMyPropertiesController = getMyPropertiesController;
const prismaClient_1 = require("../lib/prismaClient");
const recommendation_service_1 = require("../service/recommendation.service");
const recommendationService = new recommendation_service_1.RecommendationService();
async function getAllPropertiesController(req, res) {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);
        const skip = (page - 1) * limit;
        const { search, sortBy = "createdAt", sortOrder = "desc", city, propertyType, status, minPrice, maxPrice, userId, } = req.query;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
            ];
        }
        if (city)
            where.city = city;
        if (propertyType)
            where.propertyType = propertyType;
        if (status)
            where.status = status;
        if (userId)
            where.userId = userId;
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = parseFloat(minPrice);
            }
            if (maxPrice !== undefined) {
                where.price.lte = parseFloat(maxPrice);
            }
        }
        let orderBy = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder === "asc" ? "asc" : "desc";
        }
        else {
            orderBy = { createdAt: "desc" };
        }
        const total = await prismaClient_1.prisma.property.count({ where });
        const properties = await prismaClient_1.prisma.property.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                favourites: {
                    select: { id: true, userId: true },
                },
            },
            orderBy,
            skip,
            take: limit,
        });
        return res.status(200).json({
            data: properties,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch properties" });
    }
}
async function getPropertyByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Property ID is required" });
        }
        const property = await prismaClient_1.prisma.property.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                favourites: {
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
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        return res.status(200).json(property);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch property" });
    }
}
async function createPropertyController(req, res) {
    try {
        const { title, description, price, address, city, state, zipCode, bedrooms, bathrooms, area, propertyType, status, images, } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prismaClient_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const property = await prismaClient_1.prisma.property.create({
            data: {
                title,
                description,
                price,
                address,
                city,
                state,
                zipCode,
                bedrooms,
                bathrooms,
                area,
                propertyType,
                status: status || "available",
                images: Array.isArray(images) ? images : [],
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(201).json(property);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to create property" });
    }
}
async function updatePropertyController(req, res) {
    try {
        const { id } = req.params;
        const { title, description, price, address, city, state, zipCode, bedrooms, bathrooms, area, propertyType, status, images, } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Property ID is required" });
        }
        // Validate types if provided
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = price;
        if (address !== undefined)
            updateData.address = address;
        if (city !== undefined)
            updateData.city = city;
        if (state !== undefined)
            updateData.state = state;
        if (zipCode !== undefined)
            updateData.zipCode = zipCode;
        if (bedrooms !== undefined)
            updateData.bedrooms = bedrooms;
        if (bathrooms !== undefined)
            updateData.bathrooms = bathrooms;
        if (area !== undefined)
            updateData.area = area;
        if (propertyType !== undefined)
            updateData.propertyType = propertyType;
        if (status !== undefined)
            updateData.status = status;
        if (images !== undefined)
            updateData.images = Array.isArray(images) ? images : [];
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ error: "At least one field is required for update" });
        }
        const updatedProperty = await prismaClient_1.prisma.property.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(200).json(updatedProperty);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to update property" });
    }
}
async function deletePropertyController(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        if (!id) {
            return res.status(400).json({ error: "Property ID is required" });
        }
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const property = await prismaClient_1.prisma.property.findUnique({
            where: { id },
        });
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.userId !== userId) {
            return res
                .status(403)
                .json({ error: "You do not have permission to delete this property" });
        }
        // Delete all favourites related to this property first
        await prismaClient_1.prisma.favourite.deleteMany({
            where: { propertyId: id },
        });
        // Now delete the property
        await prismaClient_1.prisma.property.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Property and related favourites deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete property" });
    }
}
async function getRecommendedPropertiesController(req, res) {
    try {
        res.set("Cache-Control", "no-store");
        const userId = req.user?.userId;
        const excludeOwned = true;
        let excludePropertyIds = [];
        if (userId && excludeOwned) {
            const ownedProperties = await prismaClient_1.prisma.property.findMany({
                where: { userId },
                select: { id: true },
            });
            excludePropertyIds = ownedProperties.map((p) => p.id);
        }
        const recommendations = await recommendationService.getRecommendations({
            userId,
            limit: 5,
            excludePropertyIds,
        });
        return res.status(200).json({
            data: recommendations,
            recommendationType: userId ? "personalized" : "popular",
        });
    }
    catch (error) {
        console.error("Recommendation error:", error);
        return res.status(500).json({
            error: "Failed to fetch recommended properties",
        });
    }
}
async function getSimilarPropertiesController(req, res) {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const similarProperties = await recommendationService.getSimilarProperties(id, limit);
        return res.status(200).json({
            data: similarProperties,
        });
    }
    catch (error) {
        console.error("Similar properties error:", error);
        return res.status(500).json({
            error: "Failed to fetch similar properties",
        });
    }
}
async function getMyPropertiesController(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const properties = await prismaClient_1.prisma.property.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
        });
        console.log(properties);
        return res.status(200).json({ data: properties });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch your properties" });
    }
}
