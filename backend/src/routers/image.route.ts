import { Router } from "express";
import { upload, uploadImage } from "../controllers/image.controller";

const router = Router();

// POST /api/images/upload
router.post("/upload", upload.single("image"), uploadImage);

export default router;
