import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance, queryClient } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const useDeleteFavouriteMutation = () => {
  return useMutation({
    mutationFn: async (data: { userId: string; propertyId: string }) => {
      const { userId, propertyId } = data;
      return await axiosInstance.delete(
        `${API_ROUTES.FAVOURITES}/user/${userId}/property/${propertyId}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["favourite", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["property", "recommended"],
      });
    },
    onError: (error: AxiosError, variables) => {
      console.log(
        "Failed to delete favourite:",
        error.response?.data || error.message
      );
    },
  });
};
