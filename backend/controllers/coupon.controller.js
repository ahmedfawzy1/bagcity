import Coupon from "../models/coupon.model.js";

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single coupon
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minPurchase, startDate, endDate, isActive, usageLimit } = req.body;

    if (!code || !description || !discountType || discountValue === undefined || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields: code, description, discountType, discountValue, startDate, endDate" });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({ message: "discountType must be 'percentage' or 'fixed'" });
    }

    if (typeof discountValue !== "number" || discountValue <= 0) {
      return res.status(400).json({ message: "discountValue must be a positive number" });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }

    if (usageLimit !== undefined && usageLimit !== null && (typeof usageLimit !== "number" || usageLimit < 1)) {
      return res.status(400).json({ message: "usageLimit must be a positive number" });
    }

    const coupon = new Coupon({
      code, description, discountType, discountValue,
      minPurchase: minPurchase || 0, startDate, endDate,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || null,
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (amount < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase amount of $${coupon.minPurchase} required`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (amount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Atomically increment usage count and check limit
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {
        _id: coupon._id,
        ...(coupon.usageLimit ? { usedCount: { $lt: coupon.usageLimit } } : {}),
      },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.status(200).json({
      valid: true,
      discountAmount,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
