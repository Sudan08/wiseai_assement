import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../libs/client"; // Your Axios instance
import { API_ROUTES } from "../enum"; // Adjust API_ROUTES as appropriate
import { PaginatedResponse, Property } from "../types"; // Your property type

export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>; // e.g. { status: "available", type: "apartment" }
}

export const useGetProperties = ({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  filters = {},
}: GetPropertiesParams) => {
  return useQuery<PaginatedResponse<Property>>({
    queryKey: [
      "properties",
      { page, limit, search, sortBy, sortOrder, filters },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = value;
        }
      });

      const response = await axiosInstance.get<PaginatedResponse<Property>>(
        API_ROUTES.PROPERTIES_GET_ALL, // e.g., "/properties"
        { params }
      );
      return response.data;
    },
  });
};
