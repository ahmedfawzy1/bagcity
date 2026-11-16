import crypto from "crypto";
import Product from "../models/product.model.js";

const secretsMatch = (provided, expected) => {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const keepAlive = async (req, res) => {
  const expected = process.env.KEEP_ALIVE_SECRET;
  if (!expected) {
    return res.status(503).json({ success: false, message: "Keep-alive is not configured" });
  }

  const header = req.get("authorization") || "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!provided || !secretsMatch(provided, expected)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    await Product.findOne().select("_id").lean();
    res.set("Cache-Control", "no-store");
    return res.status(200).json({ success: true, checkedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Keep-alive query failed:", error.message);
    return res.status(503).json({ success: false, message: "Database query failed" });
  }
};
