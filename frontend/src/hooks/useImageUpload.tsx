import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../libs/client";
import { UploadResponse } from "../types";
import { API_ROUTES } from "../enum";
import { AxiosError } from "axios";

export const useImageUploadMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return (
        await axiosInstance.post<UploadResponse>(API_ROUTES.UPLOAD, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log("Upload error:", error.response?.data || error.message);
    },
  });
};
