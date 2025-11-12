import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure public/assets folder exists
const uploadDir = path.join(__dirname, "../../public/assets");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage });

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `/assets/${req.file.filename}`; // URL relative to public folder
  res.json({ url: fileUrl });
};
