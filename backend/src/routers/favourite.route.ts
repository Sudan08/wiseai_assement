import { Router } from "express";
import {
  createFavouriteController,
  deleteFavouriteByUserAndPropertyController,
  deleteFavouriteController,
  getAllFavouritesController,
  getFavouriteByIdController,
} from "../controllers/favourite.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/favourites", authMiddleware, getAllFavouritesController);

router.post("/favourites", authMiddleware, createFavouriteController);

router.delete("/favourites/:id", authMiddleware, deleteFavouriteController);

router.delete(
  "/favourites/user/:userId/property/:propertyId",
  authMiddleware,
  deleteFavouriteByUserAndPropertyController
);

export default router;
