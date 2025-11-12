import { prisma } from "../lib/prismaClient";

interface RecommendationOptions {
  userId?: string;
  limit?: number;
  excludePropertyIds?: string[];
}

export class RecommendationService {
  async getRecommendations(options: RecommendationOptions) {
    const { userId, limit = 5, excludePropertyIds = [] } = options;

    let recommendations: any[] = [];

    if (userId) {
      recommendations = await this.getCollaborativeRecommendations(
        userId,
        limit,
        excludePropertyIds
      );

      if (recommendations.length < limit) {
        const contentBased = await this.getContentBasedRecommendations(
          userId,
          limit - recommendations.length,
          [...excludePropertyIds, ...recommendations.map((r) => r.id)]
        );
        recommendations.push(...contentBased);
      }
    }

    if (recommendations.length < limit) {
      const popular = await this.getPopularProperties(
        limit - recommendations.length,
        [...excludePropertyIds, ...recommendations.map((r) => r.id)]
      );
      recommendations.push(...popular);
    }

    return recommendations.slice(0, limit);
  }

  private async getCollaborativeRecommendations(
    userId: string,
    limit: number,
    excludeIds: string[]
  ) {
    // 1. Get user's favorited properties
    const userFavorites = await prisma.favourite.findMany({
      where: { userId },
      select: { propertyId: true },
    });

    if (userFavorites.length === 0) {
      return [];
    }

    const userFavPropertyIds = userFavorites.map((f) => f.propertyId);

    const similarUsers = await prisma.favourite.groupBy({
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

    const recommendations = await prisma.property.findMany({
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

  private async getContentBasedRecommendations(
    userId: string,
    limit: number,
    excludeIds: string[]
  ) {
    // Get user's favorite properties to understand preferences
    const userFavorites = await prisma.favourite.findMany({
      where: { userId },
      include: { property: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    if (userFavorites.length === 0) {
      return [];
    }

    const preferences = this.calculatePreferences(
      userFavorites.map((f) => f.property)
    );

    // Find similar properties
    const recommendations = await prisma.property.findMany({
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

  private async getPopularProperties(limit: number, excludeIds: string[]) {
    const popular = await prisma.property.findMany({
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

  private calculatePreferences(properties: any[]) {
    const cities = [...new Set(properties.map((p) => p.city))];
    const propertyTypes = [...new Set(properties.map((p) => p.propertyType))];

    const prices = properties.map((p) => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceRange = {
      min: avgPrice * 0.7, // 30% below average
      max: avgPrice * 1.3, // 30% above average
    };

    return { cities, propertyTypes, priceRange };
  }

  async getSimilarProperties(propertyId: string, limit: number = 5) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return [];
    }

    const similar = await prisma.property.findMany({
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
