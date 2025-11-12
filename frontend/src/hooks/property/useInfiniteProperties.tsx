import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";
import { PaginatedResponse, Property } from "../../types";

interface PropertyFilters {
  city?: string;
  propertyType?: string; // Changed from 'type' to match backend
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

interface UseInfinitePropertiesParams {
  search?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: PropertyFilters;
  enabled?: boolean;
}

export const useInfiniteProperties = ({
  search = "",
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  filters = {},
  enabled = true,
}: UseInfinitePropertiesParams = {}) => {
  return useInfiniteQuery<PaginatedResponse<Property>>({
    queryKey: [
      "properties-infinite",
      search,
      limit,
      sortBy,
      sortOrder,
      filters,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, any> = {
        page: pageParam,
        limit,
      };

      // Add search
      if (search) params.search = search;

      // Add sorting
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      // Add filters - only include defined values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params[key] = value;
        }
      });

      const response = await axiosInstance.get<PaginatedResponse<Property>>(
        API_ROUTES.PROPERTIES,
        { params }
      );

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total } = lastPage;
      return page < total ? page + 1 : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
