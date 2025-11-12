import { z } from "zod";

const propertyTypeEnum = z.enum([
  "apartment",
  "house",
  "condo",
  "villa",
  "townhouse",
  "studio",
]);

const propertyStatusEnum = z.enum(["available", "sold", "rented", "pending"]);

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().max(5000, "Description is too long").optional(),
    price: z.number().positive("Price must be a positive number"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(500, "Address is too long"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City name is too long"),
    state: z
      .string()
      .min(1, "State is required")
      .max(100, "State name is too long"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .max(20, "Zip code is too long"),
    bedrooms: z
      .number()
      .int("Bedrooms must be an integer")
      .min(0, "Bedrooms cannot be negative"),
    bathrooms: z
      .number()
      .int("Bathrooms must be an integer")
      .min(0, "Bathrooms cannot be negative"),
    area: z.number().positive("Area must be a positive number"),
    propertyType: propertyTypeEnum,
    status: propertyStatusEnum.optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
  }),
});

// Update property schema
export const updatePropertySchema = z.object({
  params: z.object({
    id: z.uuid("Invalid property ID"),
  }),
  body: z
    .object({
      title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(255, "Title is too long")
        .optional(),
      description: z.string().max(5000, "Description is too long").optional(),
      price: z.number().positive("Price must be a positive number").optional(),
      address: z
        .string()
        .min(1, "Address cannot be empty")
        .max(500, "Address is too long")
        .optional(),
      city: z
        .string()
        .min(1, "City cannot be empty")
        .max(100, "City name is too long")
        .optional(),
      state: z
        .string()
        .min(1, "State cannot be empty")
        .max(100, "State name is too long")
        .optional(),
      zipCode: z
        .string()
        .min(1, "Zip code cannot be empty")
        .max(20, "Zip code is too long")
        .optional(),
      bedrooms: z
        .number()
        .int("Bedrooms must be an integer")
        .min(0, "Bedrooms cannot be negative")
        .optional(),
      bathrooms: z
        .number()
        .int("Bathrooms must be an integer")
        .min(0, "Bathrooms cannot be negative")
        .optional(),
      area: z.number().positive("Area must be a positive number").optional(),
      propertyType: propertyTypeEnum.optional(),
      status: propertyStatusEnum.optional(),
      images: z.array(z.string().url("Invalid image URL")).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const getPropertyByIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid property ID"),
  }),
});

export const getAllPropertiesSchema = z.object({
  query: z.object({
    city: z.string().optional(),
    propertyType: propertyTypeEnum.optional(),
    status: propertyStatusEnum.optional(),
    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "minPrice must be a number")
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "maxPrice must be a number")
      .optional(),
  }),
});

export const deletePropertySchema = z.object({
  params: z.object({
    id: z.uuid("Invalid property ID"),
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>["body"];
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>["body"];
export type PropertyFilters = z.infer<typeof getAllPropertiesSchema>["query"];
