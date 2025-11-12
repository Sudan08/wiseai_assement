import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  price: z.string().min(1, "Price is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  bedrooms: z.string().min(1, "Bedrooms are required"),
  bathrooms: z.string().min(1, "Bathrooms are required"),
  area: z.string().min(1, "Area is required"),
  propertyType: z.string().min(1, "Property type is required"),
  status: z.string().min(1, "Status is required"),
});

// TypeScript type inferred from Zod
export type PropertyFormSchemaType = z.infer<typeof propertyFormSchema>;
