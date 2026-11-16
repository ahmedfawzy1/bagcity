import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const name = `${req.user.first_name} ${req.user.last_name}`.trim();
    const email = req.user.email;

    if (rating === undefined || rating === null || !comment || !productId) {
      return res.status(400).json({ message: "Rating, comment, and productId are required" });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has purchased this product
    const hasPurchased = await hasUserPurchasedProduct(req.user._id, productId);
    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can only review products you have purchased and received",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      email: email,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create new review
    const newReview = new Review({
      name,
      email,
      rating,
      comment,
      product: productId,
    });

    // Save review
    await newReview.save();

    // Calculate new average rating incrementally
    const oldTotalRating = product.averageRating * product.reviews.length;
    const newTotalRating = oldTotalRating + rating;
    const newAverageRating = newTotalRating / (product.reviews.length + 1);

    // Add review to product and update average rating
    product.reviews.push(newReview._id);
    product.averageRating = newAverageRating;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({ reviews: [], currentPage: 1, totalPages: 0, totalReviews: 0 });
    }

    // Get paginated reviews
    const reviews = await Review.find({ product: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Review.countDocuments({ product: id });

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const uniqueFiveStarReviewIds = await Review.aggregate([
      { $match: { rating: 5 } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$email",
          reviewId: { $first: "$_id" },
        },
      },
    ]);

    const reviewIds = uniqueFiveStarReviewIds.map((item) => item.reviewId);

    const total = reviewIds.length;

    // Fetch the full review documents for the unique IDs
    const reviews = await Review.find({ _id: { $in: reviewIds } })
      .populate("product", "name priceRange images")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

const hasUserPurchasedProduct = async (userId, productId) => {
  try {
    const order = await Order.findOne({
      customer: userId,
      "items.product": productId,
      orderStatus: "delivered",
    });
    return !!order;
  } catch (error) {
    console.error("Error checking purchase history:", error);
    return false;
  }
};

export const checkCanReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(200).json({
        canReview: false,
        hasPurchased: false,
        hasReviewed: false,
        message: "Product not found",
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await hasUserPurchasedProduct(req.user._id, productId);

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      email: req.user.email,
    });

    res.status(200).json({
      canReview: hasPurchased && !existingReview,
      hasPurchased,
      hasReviewed: !!existingReview,
      message: hasPurchased
        ? existingReview
          ? "You have already reviewed this product"
          : "You can review this product"
        : "You can only review products you have purchased and received",
    });
  } catch (error) {
    console.error("Error checking review status:", error);
    res.status(500).json({ message: "Error checking review status", error: error.message });
  }
};
