import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { AxiosError } from "axios";
import { axiosInstance, queryClient } from "../../libs/client";
import { Favourite } from "../../types";
import { API_ROUTES } from "../../enum";

export const usePostFavouriteMutation = () => {
  return useMutation({
    mutationFn: async (data: { userId: string; propertyId: string }) => {
      return (await axiosInstance.post<Favourite>(API_ROUTES.FAVOURITES, data))
        .data;
    },
    onSuccess: (data: Favourite, variables) => {
      console.log("Favourite added:", data);
      queryClient.invalidateQueries({
        queryKey: ["favourite", variables.userId],
      });
    },
    onError: (error: AxiosError) => {
      console.log(error.response?.data || error.message);
    },
  });
};
