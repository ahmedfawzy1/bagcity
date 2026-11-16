import Category from "../models/category.model.js";
import Color from "../models/color.model.js";

export const getFilters = async (req, res) => {
  try {
    const categories = await Category.find();
    const colors = await Color.find();

    res.status(200).json({ categories, colors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
