import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance, queryClient } from "../../libs/client";
import { API_ROUTES } from "../../enum";

export const useDeletePropertyMutation = () => {
  return useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      return await axiosInstance.delete(
        `${API_ROUTES.PROPERTIES}/${propertyId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property"],
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
