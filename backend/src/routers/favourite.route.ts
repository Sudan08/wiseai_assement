import { Router } from "express";
import {
  createFavouriteController,
  deleteFavouriteByUserAndPropertyController,
  deleteFavouriteController,
  getAllFavouritesController,
  getFavouriteByIdController,
} from "../controllers/favourite.controller";

const router = Router();

router.get("/favourites", getAllFavouritesController);

router.get("/favourites/:id", getFavouriteByIdController);

router.post("/favourites", createFavouriteController);

router.delete("/favourites/:id", deleteFavouriteController);

router.delete(
  "/favourites/user/:userId/property/:propertyId",
  deleteFavouriteByUserAndPropertyController
);

export default router;
