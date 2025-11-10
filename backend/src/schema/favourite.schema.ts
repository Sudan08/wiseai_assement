import { z } from "zod";

// Create favourite schema
export const createFavouriteSchema = z.object({
  body: z.object({
    userId: z.uuid("Invalid user ID"),
    propertyId: z.uuid("Invalid property ID"),
  }),
});

// Get favourite by ID schema
export const getFavouriteByIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid favourite ID"),
  }),
});

// Get all favourites query schema (filters)
export const getAllFavouritesSchema = z.object({
  query: z.object({
    userId: z.uuid("Invalid user ID").optional(),
    propertyId: z.uuid("Invalid property ID").optional(),
  }),
});

// Delete favourite schema
export const deleteFavouriteSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid favourite ID"),
  }),
});

// Delete favourite by user and property schema
export const deleteFavouriteByUserAndPropertySchema = z.object({
  params: z.object({
    userId: z.uuid("Invalid user ID"),
    propertyId: z.uuid("Invalid property ID"),
  }),
});

// Type exports
export type CreateFavouriteInput = z.infer<
  typeof createFavouriteSchema
>["body"];
export type FavouriteFilters = z.infer<typeof getAllFavouritesSchema>["query"];
