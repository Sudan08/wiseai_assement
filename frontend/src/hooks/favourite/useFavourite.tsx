import React, { useContext } from "react";
import { useGetFavourites } from "./useGetFavourites";
import { useAuth } from "../auth/useAuth";
import { Favourite } from "../../types";

interface FavouriteContext {
  favourites: Favourite[] | [];
}

const FavouriteContext = React.createContext<FavouriteContext | undefined>(
  undefined
);

export const FavouriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data } = useAuth();
  const { data: favourites } = useGetFavourites(data?.user?.id);

  return (
    <FavouriteContext.Provider value={{ favourites: favourites || [] }}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => {
  const context = useContext(FavouriteContext);
  if (!context)
    throw new Error("useFavourite must be used within an AuthProvider");
  return context;
};
