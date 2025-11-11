import { useQuery } from "@tanstack/react-query";
import { Favourite } from "../../types";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const useGetFavourites = (userId?: string) => {
  return useQuery<Favourite[]>({
    queryKey: ["favourite", userId],
    enabled: !!userId, // Only fetch if propertyId is provided
    queryFn: async () => {
      if (!userId) throw new Error("No userId provided");
      const res = await axiosInstance.get<Favourite[]>(
        `${API_ROUTES.FAVOURITES}?userId=${userId}`
      );
      return res.data;
    },
  });
};
