import express from "express";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/get-favourites", getFavourites);
router.post("/add-favourite", addFavourite);
router.delete("/remove-favourite", removeFavourite);
// router.get("/get-properties", getProperties);

export default router;
