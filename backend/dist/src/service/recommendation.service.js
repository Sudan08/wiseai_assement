"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const prismaClient_1 = require("../lib/prismaClient");
class RecommendationService {
    async getRecommendations(options) {
        const { userId, limit = 5, excludePropertyIds = [] } = options;
        let recommendations = [];
        if (userId) {
            recommendations = await this.getCollaborativeRecommendations(userId, limit, excludePropertyIds);
            if (recommendations.length < limit) {
                const contentBased = await this.getContentBasedRecommendations(userId, limit - recommendations.length, [...excludePropertyIds, ...recommendations.map((r) => r.id)]);
                recommendations.push(...contentBased);
            }
        }
        if (recommendations.length < limit) {
            const popular = await this.getPopularProperties(limit - recommendations.length, [...excludePropertyIds, ...recommendations.map((r) => r.id)]);
            recommendations.push(...popular);
        }
        return recommendations.slice(0, limit);
    }
    async getCollaborativeRecommendations(userId, limit, excludeIds) {
        // 1. Get user's favorited properties
        const userFavorites = await prismaClient_1.prisma.favourite.findMany({
            where: { userId },
            select: { propertyId: true },
        });
        if (userFavorites.length === 0) {
            return [];
        }
        const userFavPropertyIds = userFavorites.map((f) => f.propertyId);
        const similarUsers = await prismaClient_1.prisma.favourite.groupBy({
            by: ["userId"],
            where: {
                propertyId: { in: userFavPropertyIds },
                userId: { not: userId },
            },
            _count: { propertyId: true },
            orderBy: { _count: { propertyId: "desc" } },
            take: 10, // Top 10 similar users
        });
        const similarUserIds = similarUsers.map((u) => u.userId);
        if (similarUserIds.length === 0) {
            return [];
        }
        const recommendations = await prismaClient_1.prisma.property.findMany({
            where: {
                id: {
                    notIn: [...userFavPropertyIds, ...excludeIds],
                },
                favourites: {
                    some: {
                        userId: { in: similarUserIds },
                    },
                },
                status: "available",
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { favourites: true },
                },
            },
            orderBy: {
                favourites: { _count: "desc" },
            },
            take: limit,
        });
        return recommendations;
    }
    async getContentBasedRecommendations(userId, limit, excludeIds) {
        // Get user's favorite properties to understand preferences
        const userFavorites = await prismaClient_1.prisma.favourite.findMany({
            where: { userId },
            include: { property: true },
            take: 5,
            orderBy: { createdAt: "desc" },
        });
        if (userFavorites.length === 0) {
            return [];
        }
        const preferences = this.calculatePreferences(userFavorites.map((f) => f.property));
        // Find similar properties
        const recommendations = await prismaClient_1.prisma.property.findMany({
            where: {
                id: { notIn: excludeIds },
                status: "available",
                OR: [
                    { city: { in: preferences.cities } },
                    { propertyType: { in: preferences.propertyTypes } },
                    {
                        AND: [
                            { price: { gte: preferences.priceRange.min } },
                            { price: { lte: preferences.priceRange.max } },
                        ],
                    },
                ],
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { favourites: true },
                },
            },
            take: limit,
        });
        return recommendations;
    }
    async getPopularProperties(limit, excludeIds) {
        const popular = await prismaClient_1.prisma.property.findMany({
            where: {
                id: { notIn: excludeIds },
                status: "available",
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { favourites: true },
                },
            },
            orderBy: [{ favourites: { _count: "desc" } }, { createdAt: "desc" }],
            take: limit,
        });
        return popular;
    }
    calculatePreferences(properties) {
        const cities = [...new Set(properties.map((p) => p.city))];
        const propertyTypes = [...new Set(properties.map((p) => p.propertyType))];
        const prices = properties.map((p) => p.price);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const priceRange = {
            min: avgPrice * 0.7,
            max: avgPrice * 1.3,
        };
        return { cities, propertyTypes, priceRange };
    }
    async getSimilarProperties(propertyId, limit = 5) {
        const property = await prismaClient_1.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            return [];
        }
        const similar = await prismaClient_1.prisma.property.findMany({
            where: {
                id: { not: propertyId },
                status: "available",
                OR: [
                    { city: property.city },
                    { propertyType: property.propertyType },
                    {
                        AND: [
                            { price: { gte: property.price * 0.8 } },
                            { price: { lte: property.price * 1.2 } },
                            { bedrooms: property.bedrooms },
                        ],
                    },
                ],
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { favourites: true },
                },
            },
            take: limit,
        });
        return similar;
    }
}
exports.RecommendationService = RecommendationService;
