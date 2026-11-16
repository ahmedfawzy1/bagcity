import express from "express";
import { protectRoute, adminProtectRoute } from "../middleware/auth.middleware.js";
import { getAllWishlists, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", adminProtectRoute, getAllWishlists);
router.get("/:userId", protectRoute, getWishlist);
router.post("/", protectRoute, addToWishlist);
router.delete("/", protectRoute, removeFromWishlist);

export default router;
