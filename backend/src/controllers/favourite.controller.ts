import { type Request, type Response } from "express";
import { prisma } from "../lib/prismaClient";

export async function getAllFavouritesController(req: Request, res: Response) {
  try {
    const { userId, propertyId } = req.query;

    const where: any = {};

    if (userId) where.userId = userId as string;
    if (propertyId) where.propertyId = propertyId as string;

    const favourites = await prisma.favourite.findMany({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch favourites" });
  }
}

export async function getFavouriteByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Favourite ID is required" });
    }

    const favourite = await prisma.favourite.findUnique({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch favourite" });
  }
}

export async function createFavouriteController(req: Request, res: Response) {
  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({ error: "userId and propertyId are required" });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Check if favourite already exists (unique constraint)
    const existingFavourite = await prisma.favourite.findUnique({
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

    const favourite = await prisma.favourite.create({
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
  } catch (error) {
    return res.status(500).json({ error: "Failed to create favourite" });
  }
}

export async function deleteFavouriteController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Favourite ID is required" });
    }

    const existingFavourite = await prisma.favourite.findUnique({
      where: { id },
    });
    if (!existingFavourite) {
      return res.status(404).json({ error: "Favourite not found" });
    }

    await prisma.favourite.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete favourite" });
  }
}

export async function deleteFavouriteByUserAndPropertyController(
  req: Request,
  res: Response
) {
  try {
    const { userId, propertyId } = req.params;

    if (!userId || !propertyId) {
      return res.status(400).json({ error: "userId and propertyId are required" });
    }

    const existingFavourite = await prisma.favourite.findUnique({
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

    await prisma.favourite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    return res.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete favourite" });
  }
}
