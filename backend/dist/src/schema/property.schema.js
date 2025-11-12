"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePropertySchema = exports.getAllPropertiesSchema = exports.getPropertyByIdSchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
const propertyTypeEnum = zod_1.z.enum([
    "apartment",
    "house",
    "condo",
    "villa",
    "townhouse",
    "studio",
]);
const propertyStatusEnum = zod_1.z.enum(["available", "sold", "rented", "pending"]);
exports.createPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(255, "Title is too long"),
        description: zod_1.z.string().max(5000, "Description is too long").optional(),
        price: zod_1.z.number().positive("Price must be a positive number"),
        address: zod_1.z
            .string()
            .min(1, "Address is required")
            .max(500, "Address is too long"),
        city: zod_1.z
            .string()
            .min(1, "City is required")
            .max(100, "City name is too long"),
        state: zod_1.z
            .string()
            .min(1, "State is required")
            .max(100, "State name is too long"),
        zipCode: zod_1.z
            .string()
            .min(1, "Zip code is required")
            .max(20, "Zip code is too long"),
        bedrooms: zod_1.z
            .number()
            .int("Bedrooms must be an integer")
            .min(0, "Bedrooms cannot be negative"),
        bathrooms: zod_1.z
            .number()
            .int("Bathrooms must be an integer")
            .min(0, "Bathrooms cannot be negative"),
        area: zod_1.z.number().positive("Area must be a positive number"),
        propertyType: propertyTypeEnum,
        status: propertyStatusEnum.optional(),
        images: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional(),
    }),
});
// Update property schema
exports.updatePropertySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid property ID"),
    }),
    body: zod_1.z
        .object({
        title: zod_1.z
            .string()
            .min(1, "Title cannot be empty")
            .max(255, "Title is too long")
            .optional(),
        description: zod_1.z.string().max(5000, "Description is too long").optional(),
        price: zod_1.z.number().positive("Price must be a positive number").optional(),
        address: zod_1.z
            .string()
            .min(1, "Address cannot be empty")
            .max(500, "Address is too long")
            .optional(),
        city: zod_1.z
            .string()
            .min(1, "City cannot be empty")
            .max(100, "City name is too long")
            .optional(),
        state: zod_1.z
            .string()
            .min(1, "State cannot be empty")
            .max(100, "State name is too long")
            .optional(),
        zipCode: zod_1.z
            .string()
            .min(1, "Zip code cannot be empty")
            .max(20, "Zip code is too long")
            .optional(),
        bedrooms: zod_1.z
            .number()
            .int("Bedrooms must be an integer")
            .min(0, "Bedrooms cannot be negative")
            .optional(),
        bathrooms: zod_1.z
            .number()
            .int("Bathrooms must be an integer")
            .min(0, "Bathrooms cannot be negative")
            .optional(),
        area: zod_1.z.number().positive("Area must be a positive number").optional(),
        propertyType: propertyTypeEnum.optional(),
        status: propertyStatusEnum.optional(),
        images: zod_1.z.array(zod_1.z.string().url("Invalid image URL")).optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    }),
});
exports.getPropertyByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid property ID"),
    }),
});
exports.getAllPropertiesSchema = zod_1.z.object({
    query: zod_1.z.object({
        city: zod_1.z.string().optional(),
        propertyType: propertyTypeEnum.optional(),
        status: propertyStatusEnum.optional(),
        minPrice: zod_1.z
            .string()
            .regex(/^\d+(\.\d+)?$/, "minPrice must be a number")
            .optional(),
        maxPrice: zod_1.z
            .string()
            .regex(/^\d+(\.\d+)?$/, "maxPrice must be a number")
            .optional(),
    }),
});
exports.deletePropertySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.uuid("Invalid property ID"),
    }),
});
