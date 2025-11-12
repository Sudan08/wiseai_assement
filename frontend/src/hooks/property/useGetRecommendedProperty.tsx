import { useQuery } from "@tanstack/react-query";
import { Property } from "../../types";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const useGetRecommendedProperty = () => {
  return useQuery<{ data: Property[] }>({
    queryKey: ["property", "recommended"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: Property[] }>(
        `${API_ROUTES.PROPERTIES}/recommended`
      );
      return res.data;
    },
  });
};
