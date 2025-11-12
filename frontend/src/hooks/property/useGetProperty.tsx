import { useQuery } from "@tanstack/react-query";
import { Property } from "../../types";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const useGetProperty = (propertyId?: string) => {
  return useQuery<Property>({
    queryKey: ["property", propertyId],
    enabled: !!propertyId, // Only fetch if propertyId is provided
    queryFn: async () => {
      if (!propertyId) throw new Error("No propertyId provided");
      const res = await axiosInstance.get<Property>(
        `${API_ROUTES.PROPERTIES}/${propertyId}`
      );
      return res.data;
    },
  });
};
