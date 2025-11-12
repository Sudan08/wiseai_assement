import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance, queryClient } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const usePatchPropertyMutation = () => {
  return useMutation({
    mutationFn: async ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: any;
    }) => {
      return await axiosInstance.patch(
        `${API_ROUTES.PROPERTIES}/${propertyId}`,
        payload
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property"],
      });
    },
    onError: (error: AxiosError, variables) => {
      console.log(
        "Failed to update property:",
        error.response?.data || error.message
      );
    },
  });
};
