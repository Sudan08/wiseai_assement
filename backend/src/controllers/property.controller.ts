import { type Request, type Response } from "express";
import { prisma } from "../lib/prismaClient";

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
        { description: { contains: search as string, mode: "insensitive" } },
        { city: { contains: search as string, mode: "insensitive" } },
        { address: { contains: search as string, mode: "insensitive" } },
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
      userId,
    } = req.body;

    // Required fields validation
    if (
      !title ||
      !price ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined ||
      !propertyType ||
      !userId
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: title, price, address, city, state, zipCode, bedrooms, bathrooms, area, propertyType, userId",
      });
    }

    // Type validation
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    if (typeof bedrooms !== "number" || bedrooms < 0) {
      return res
        .status(400)
        .json({ error: "Bedrooms must be a non-negative number" });
    }
    if (typeof bathrooms !== "number" || bathrooms < 0) {
      return res
        .status(400)
        .json({ error: "Bathrooms must be a non-negative number" });
    }
    if (typeof area !== "number" || area <= 0) {
      return res.status(400).json({ error: "Area must be a positive number" });
    }

    // Verify user exists
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
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    if (
      bedrooms !== undefined &&
      (typeof bedrooms !== "number" || bedrooms < 0)
    ) {
      return res
        .status(400)
        .json({ error: "Bedrooms must be a non-negative number" });
    }
    if (
      bathrooms !== undefined &&
      (typeof bathrooms !== "number" || bathrooms < 0)
    ) {
      return res
        .status(400)
        .json({ error: "Bathrooms must be a non-negative number" });
    }
    if (area !== undefined && (typeof area !== "number" || area <= 0)) {
      return res.status(400).json({ error: "Area must be a positive number" });
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });
    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

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

    if (!id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });
    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    await prisma.property.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete property" });
  }
}
