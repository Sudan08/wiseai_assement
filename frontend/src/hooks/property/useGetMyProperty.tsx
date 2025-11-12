import { useQuery } from "@tanstack/react-query";
import { Property } from "../../types";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";
import { useAuth } from "../auth/useAuth";

export const useGetMyProperty = () => {
  const { data } = useAuth();
  const userId = data?.user.id;
  return useQuery<{ data: Property[] }>({
    queryKey: ["property", "my", userId],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: Property[] }>(
        `${API_ROUTES.PROPERTIES}/my`
      );
      return res.data;
    },
  });
};
