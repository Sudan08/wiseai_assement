"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../controllers/image.controller");
const router = (0, express_1.Router)();
// POST /api/images/upload
router.post("/upload", image_controller_1.upload.single("image"), image_controller_1.uploadImage);
exports.default = router;
