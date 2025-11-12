import { type Request, type Response } from "express";
import { prisma } from "../lib/prismaClient";
import { RecommendationService } from "../service/recommendation.service";

const recommendationService = new RecommendationService();

export async function getAllPropertiesController(req: Request, res: Response) {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const skip = (page - 1) * limit;

    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      city,
      propertyType,
      status,
      minPrice,
      maxPrice,
      userId,
    } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (city) where.city = city as string;
    if (propertyType) where.propertyType = propertyType as string;
    if (status) where.status = status as string;
    if (userId) where.userId = userId as string;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = parseFloat(minPrice as string);
      }
      if (maxPrice !== undefined) {
        where.price.lte = parseFloat(maxPrice as string);
      }
    }

    let orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy as string] = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy = { createdAt: "desc" };
    }

    const total = await prisma.property.count({ where });

    const properties = await prisma.property.findMany({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch properties" });
  }
}

export async function getPropertyByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const property = await prisma.property.findUnique({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch property" });
  }
}

export async function createPropertyController(req: Request, res: Response) {
  try {
    const {
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
      status,
      images,
    } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const property = await prisma.property.create({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to create property" });
  }
}

export async function updatePropertyController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
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
      status,
      images,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    // Validate types if provided

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
    if (area !== undefined) updateData.area = area;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (status !== undefined) updateData.status = status;
    if (images !== undefined)
      updateData.images = Array.isArray(images) ? images : [];

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    const updatedProperty = await prisma.property.update({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to update property" });
  }
}

export async function deletePropertyController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const property = await prisma.property.findUnique({
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
    await prisma.favourite.deleteMany({
      where: { propertyId: id },
    });

    // Now delete the property
    await prisma.property.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Property and related favourites deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete property" });
  }
}

export async function getRecommendedPropertiesController(
  req: Request,
  res: Response
) {
  try {
    res.set("Cache-Control", "no-store");
    const userId = req.user?.userId;

    const excludeOwned = true;
    let excludePropertyIds: string[] = [];

    if (userId && excludeOwned) {
      const ownedProperties = await prisma.property.findMany({
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
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({
      error: "Failed to fetch recommended properties",
    });
  }
}

export async function getSimilarPropertiesController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const similarProperties = await recommendationService.getSimilarProperties(
      id,
      limit
    );

    return res.status(200).json({
      data: similarProperties,
    });
  } catch (error) {
    console.error("Similar properties error:", error);
    return res.status(500).json({
      error: "Failed to fetch similar properties",
    });
  }
}

export async function getMyPropertiesController(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const properties = await prisma.property.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    console.log(properties);

    return res.status(200).json({ data: properties });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch your properties" });
  }
}
