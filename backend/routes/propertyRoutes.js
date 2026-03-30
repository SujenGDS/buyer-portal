import express from "express";
import { getProperties } from "../controllers/propertyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.get("/get-properties", getProperties);

export default router;
