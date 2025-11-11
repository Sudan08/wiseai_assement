import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../libs/client"; // path may vary
import { API_ROUTES } from "../enum"; // path may vary
import { Property } from "../types"; // path may vary

export const useGetProperty = (propertyId?: string) => {
  return useQuery<Property>({
    queryKey: ["property", propertyId],
    enabled: !!propertyId, // Only fetch if propertyId is provided
    queryFn: async () => {
      if (!propertyId) throw new Error("No propertyId provided");
      const res = await axiosInstance.get<Property>(
        `${API_ROUTES.PROPERTIES_GET_ALL}/${propertyId}`
      );
      return res.data;
    },
  });
};
